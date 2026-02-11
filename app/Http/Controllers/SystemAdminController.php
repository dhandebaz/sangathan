<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\User;
use App\Models\Form;
use App\Models\Meeting;
use App\Models\PaymentClaim;
use App\Models\AuditLog;
use App\Models\FormSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class SystemAdminController extends Controller
{
    /**
     * Display system admin dashboard.
     */
    public function dashboard()
    {
        $metrics = [
            'total_organisations' => Organisation::count(),
            'active_organisations' => Organisation::where('updated_at', '>=', Carbon::now()->subDays(30))->count(),
            'total_users' => User::count(),
            'total_forms' => Form::count(),
            'total_form_submissions' => FormSubmission::where('created_at', '>=', Carbon::now()->subDays(30))->count(),
            'total_meetings' => Meeting::count(),
            'total_payment_claims' => PaymentClaim::count(),
            'total_supporters' => Organisation::where('is_supporter', true)->count(),
        ];

        $monthly_remr = $metrics['total_supporters'] * 99; // ₹99 per supporter

        return view('system-admin.dashboard', compact('metrics', 'monthly_remr'));
    }

    /**
     * Display organisations list.
     */
    public function organisations(Request $request)
    {
        $query = Organisation::withCount(['users', 'members', 'meetings'])
                            ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'suspended') {
                $query->where('is_suspended', true);
            } elseif ($request->status === 'active') {
                $query->where('is_suspended', false);
            }
        }

        $organisations = $query->paginate(20);

        return view('system-admin.organisations.index', compact('organisations'));
    }

    /**
     * Display organisation details.
     */
    public function organisation(Organisation $organisation)
    {
        $organisation->loadCount(['users', 'members', 'meetings', 'forms']);
        
        return view('system-admin.organisations.show', compact('organisation'));
    }

    /**
     * Suspend organisation.
     */
    public function suspendOrganisation(Organisation $organisation, Request $request)
    {
        $organisation->update(['is_suspended' => true]);

        // Log the action
        AuditLog::log('organisation_suspended', $organisation, [
            'reason' => $request->input('reason', 'No reason provided'),
        ], $request);

        return redirect()->route('system-admin.organisations.show', $organisation)
                        ->with('success', 'Organisation suspended successfully.');
    }

    /**
     * Unsuspend organisation.
     */
    public function unsuspendOrganisation(Organisation $organisation, Request $request)
    {
        $organisation->update(['is_suspended' => false]);

        // Log the action
        AuditLog::log('organisation_unsuspended', $organisation, [], $request);

        return redirect()->route('system-admin.organisations.show', $organisation)
                        ->with('success', 'Organisation unsuspended successfully.');
    }

    /**
     * Display users list.
     */
    public function users(Request $request)
    {
        $query = User::with('organisations')
                    ->orderBy('created_at', 'desc');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            if ($request->status === 'disabled') {
                $query->where('is_disabled', true);
            } elseif ($request->status === 'active') {
                $query->where('is_disabled', false);
            }
        }

        $users = $query->paginate(20);

        return view('system-admin.users.index', compact('users'));
    }

    /**
     * Display user details.
     */
    public function user(User $user)
    {
        $user->load(['organisations', 'auditLogs' => function($query) {
            $query->latest()->limit(10);
        }]);

        return view('system-admin.users.show', compact('user'));
    }

    /**
     * Disable user.
     */
    public function disableUser(User $user, Request $request)
    {
        $user->update(['is_disabled' => true]);

        // Log the action
        AuditLog::log('user_disabled', $user, [
            'reason' => $request->input('reason', 'No reason provided'),
        ], $request);

        return redirect()->route('system-admin.users.show', $user)
                        ->with('success', 'User disabled successfully.');
    }

    /**
     * Enable user.
     */
    public function enableUser(User $user, Request $request)
    {
        $user->update(['is_disabled' => false]);

        // Log the action
        AuditLog::log('user_enabled', $user, [], $request);

        return redirect()->route('system-admin.users.show', $user)
                        ->with('success', 'User enabled successfully.');
    }

    /**
     * Display supporters overview.
     */
    public function supporters()
    {
        $supporters = Organisation::where('is_supporter', true)
                                   ->withCount(['users', 'members', 'forms'])
                                   ->orderBy('supporter_since', 'desc')
                                   ->paginate(20);

        $metrics = [
            'total_supporters' => Organisation::where('is_supporter', true)->count(),
            'active_supporters' => Organisation::where('is_supporter', true)
                                               ->where('supporter_until', '>=', Carbon::now())
                                               ->count(),
            'monthly_revenue' => Organisation::where('is_supporter', true)
                                               ->where('supporter_until', '>=', Carbon::now())
                                               ->count() * 99,
        ];

        return view('system-admin.supporters.index', compact('supporters', 'metrics'));
    }

    /**
     * Toggle supporter status.
     */
    public function toggleSupporterStatus(Organisation $organisation, Request $request)
    {
        $isSupporter = !$organisation->is_supporter;
        $organisation->update([
            'is_supporter' => $isSupporter,
            'supporter_since' => $isSupporter ? Carbon::now() : null,
            'supporter_until' => $isSupporter ? Carbon::now()->addYear() : null,
        ]);

        // Log the action
        AuditLog::log('supporter_status_toggled', $organisation, [
            'new_status' => $isSupporter ? 'supporter' : 'regular',
            'reason' => $request->input('reason', 'Manual toggle by system admin'),
        ], $request);

        return redirect()->route('system-admin.supporters.index')
                        ->with('success', 'Supporter status updated successfully.');
    }

    /**
     * Display forms abuse monitoring.
     */
    public function formsAbuse()
    {
        // Get forms with high submission rates in last 24 hours
        $abusiveForms = Form::select('forms.*')
                             ->selectRaw('COUNT(form_submissions.id) as submission_count')
                             ->leftJoin('form_submissions', function($join) {
                                 $join->on('forms.id', '=', 'form_submissions.form_id')
                                      ->where('form_submissions.created_at', '>=', Carbon::now()->subHours(24));
                             })
                             ->groupBy('forms.id')
                             ->having('submission_count', '>', 50) // More than 50 submissions in 24h
                             ->with(['organisation', 'submissions' => function($query) {
                                 $query->where('created_at', '>=', Carbon::now()->subHours(24))
                                       ->latest();
                             }])
                             ->paginate(20);

        // Get recent activity
        $recentActivity = FormSubmission::where('created_at', '>=', Carbon::now()->subHours(1))
                                       ->count();

        return view('system-admin.forms-abuse.index', compact('abusiveForms', 'recentActivity'));
    }

    /**
     * Disable form.
     */
    public function disableForm(Form $form, Request $request)
    {
        $form->update(['is_disabled' => true]);

        // Log the action
        AuditLog::log('form_disabled', $form, [
            'reason' => $request->input('reason', 'Abuse prevention'),
        ], $request);

        return redirect()->route('system-admin.forms-abuse.index')
                        ->with('success', 'Form disabled successfully.');
    }

    /**
     * Enable form.
     */
    public function enableForm(Form $form, Request $request)
    {
        $form->update(['is_disabled' => false]);

        // Log the action
        AuditLog::log('form_enabled', $form, [], $request);

        return redirect()->route('system-admin.forms-abuse.index')
                        ->with('success', 'Form enabled successfully.');
    }

    /**
     * Display storage monitoring.
     */
    public function storage()
    {
        // Get storage usage by organisation (approximate)
        $organisations = Organisation::select('organisations.*')
                                    ->selectRaw('(
                                        SELECT COUNT(*) * 0.5 
                                        FROM members 
                                        WHERE members.organisation_id = organisations.id
                                    ) + (
                                        SELECT COUNT(*) * 0.1 
                                        FROM meetings 
                                        WHERE meetings.organisation_id = organisations.id
                                    ) + (
                                        SELECT COUNT(*) * 0.2 
                                        FROM form_submissions 
                                        WHERE form_submissions.organisation_id = organisations.id
                                    ) as estimated_storage_mb')
                                    ->orderBy('estimated_storage_mb', 'desc')
                                    ->limit(10)
                                    ->get();

        $totalFiles = DB::table('files')->count(); // If you have a files table
        $totalStorage = $this->getTotalStorageUsage();

        return view('system-admin.storage.index', compact('organisations', 'totalFiles', 'totalStorage'));
    }

    /**
     * Display audit logs.
     */
    public function auditLogs(Request $request)
    {
        $query = AuditLog::with('actor')
                        ->orderBy('created_at', 'desc');

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        if ($request->filled('user')) {
            $query->where('actor_user_id', $request->user);
        }

        $auditLogs = $query->paginate(50);

        return view('system-admin.audit-logs.index', compact('auditLogs'));
    }

    /**
     * Get total storage usage (approximate).
     */
    private function getTotalStorageUsage()
    {
        // This is an approximation based on record counts
        $members = DB::table('members')->count() * 0.5; // MB
        $meetings = DB::table('meetings')->count() * 0.1; // MB
        $forms = DB::table('forms')->count() * 0.2; // MB
        $submissions = DB::table('form_submissions')->count() * 0.2; // MB

        return round($members + $meetings + $forms + $submissions, 2);
    }
}