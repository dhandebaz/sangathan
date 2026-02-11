<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\FormSubmission;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    /**
     * Display a listing of the submissions for a form.
     */
    public function index(Form $form)
    {
        $this->authorize('view', $form);

        $submissions = $form->submissions()
                            ->with(['values.field'])
                            ->paginate(20);

        return view('forms.submissions.index', compact('form', 'submissions'));
    }

    /**
     * Display the specified submission.
     */
    public function show(Form $form, FormSubmission $submission)
    {
        $this->authorize('view', $form);

        if ($submission->form_id !== $form->id) {
            abort(404);
        }

        $submission->load(['values.field']);

        return view('forms.submissions.show', compact('form', 'submission'));
    }

    /**
     * Convert submission to member.
     */
    public function convertToMember(Request $request, Form $form, FormSubmission $submission)
    {
        $this->authorize('update', $form);

        if ($submission->form_id !== $form->id) {
            abort(404);
        }

        if (!$submission->canConvertToMember()) {
            return back()->with('error', 'This submission cannot be converted to a member. Required fields (name and phone) are missing.');
        }

        $memberData = $submission->toMemberData();
        $organisationId = session('current_organisation_id');

        // Check for duplicate phone number
        $existingMember = Member::forOrganisation($organisationId)
            ->where('phone_number', $memberData['phone_number'])
            ->first();

        if ($existingMember) {
            return back()->with('error', 'A member with this phone number already exists in your organisation.');
        }

        // Create member
        $member = Member::create(array_merge($memberData, [
            'organisation_id' => $organisationId,
            'status' => 'active',
        ]));

        // Mark submission as converted (optional - could add a flag)
        // For now, we'll just redirect to the new member

        return redirect()->route('members.show', $member)
                        ->with('success', 'Submission successfully converted to member.');
    }

    /**
     * Filter submissions by date.
     */
    public function filterByDate(Request $request, Form $form)
    {
        $this->authorize('view', $form);

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $query = $form->submissions()->with(['values.field']);

        if ($request->filled('start_date')) {
            $query->whereDate('submitted_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('submitted_at', '<=', $request->end_date);
        }

        $submissions = $query->paginate(20);

        return view('forms.submissions.index', compact('form', 'submissions'));
    }
}