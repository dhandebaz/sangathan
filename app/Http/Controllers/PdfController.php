<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Meeting;
use App\Models\Form;
use App\Models\FormSubmission;
use App\Models\Donation;
use App\Models\Organisation;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PdfController extends Controller
{
    /**
     * Export Member Register as PDF
     */
    public function exportMembers(Request $request)
    {
        $organisationId = session('current_organisation_id');
        $organisation = Organisation::findOrFail($organisationId);
        
        $members = Member::forOrganisation($organisationId)
                        ->orderBy('name')
                        ->get();
        
        $data = [
            'organisation' => $organisation,
            'members' => $members,
            'generated_date' => now()->format('d/m/Y H:i'),
            'show_branding' => $this->shouldShowBranding($organisation),
        ];
        
        $pdf = Pdf::loadView('pdf.members', $data);
        $pdf->setPaper('A4', 'portrait');
        
        return $pdf->download('member-register-' . date('Y-m-d') . '.pdf');
    }
    
    /**
     * Export Donation Register as PDF
     */
    public function exportDonations(Request $request)
    {
        $organisationId = session('current_organisation_id');
        $organisation = Organisation::findOrFail($organisationId);
        
        $query = Donation::forOrganisation($organisationId);
        
        // Apply date range filter if provided
        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', $request->end_date . ' 23:59:59');
        }
        
        $donations = $query->orderBy('created_at', 'desc')->get();
        
        $data = [
            'organisation' => $organisation,
            'donations' => $donations,
            'date_range' => $this->getDateRangeText($request),
            'generated_date' => now()->format('d/m/Y H:i'),
            'show_branding' => $this->shouldShowBranding($organisation),
        ];
        
        $pdf = Pdf::loadView('pdf.donations', $data);
        $pdf->setPaper('A4', 'portrait');
        
        return $pdf->download('donation-register-' . date('Y-m-d') . '.pdf');
    }
    
    /**
     * Export Meeting Minutes as PDF
     */
    public function exportMeetingMinutes(Meeting $meeting)
    {
        $this->authorize('view', $meeting);
        
        $organisation = Organisation::findOrFail(session('current_organisation_id'));
        
        $data = [
            'organisation' => $organisation,
            'meeting' => $meeting->load(['attendees', 'organisation']),
            'generated_date' => now()->format('d/m/Y H:i'),
            'show_branding' => $this->shouldShowBranding($organisation),
        ];
        
        $pdf = Pdf::loadView('pdf.meeting-minutes', $data);
        $pdf->setPaper('A4', 'portrait');
        
        return $pdf->download('meeting-minutes-' . $meeting->id . '-' . date('Y-m-d') . '.pdf');
    }
    
    /**
     * Export Form Submissions Summary as PDF
     */
    public function exportFormSubmissionsSummary(Form $form, Request $request)
    {
        $this->authorize('view', $form);
        
        $organisation = Organisation::findOrFail(session('current_organisation_id'));
        
        $query = $form->submissions();
        
        // Apply date range filter if provided
        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', $request->end_date . ' 23:59:59');
        }
        
        $submissions = $query->orderBy('created_at', 'desc')->get();
        
        // Get key fields for summary table
        $keyFields = $form->fields()->where('include_in_summary', true)->get();
        
        $data = [
            'organisation' => $organisation,
            'form' => $form,
            'submissions' => $submissions,
            'keyFields' => $keyFields,
            'date_range' => $this->getDateRangeText($request),
            'generated_date' => now()->format('d/m/Y H:i'),
            'show_branding' => $this->shouldShowBranding($organisation),
        ];
        
        $pdf = Pdf::loadView('pdf.form-submissions-summary', $data);
        $pdf->setPaper('A4', 'portrait');
        
        return $pdf->download('form-submissions-summary-' . $form->id . '-' . date('Y-m-d') . '.pdf');
    }
    
    /**
     * Export Individual Form Submission as PDF
     */
    public function exportFormSubmission(FormSubmission $submission)
    {
        $this->authorize('view', $submission);
        
        $organisation = Organisation::findOrFail(session('current_organisation_id'));
        
        $data = [
            'organisation' => $organisation,
            'submission' => $submission->load(['form', 'values.field']),
            'generated_date' => now()->format('d/m/Y H:i'),
            'show_branding' => $this->shouldShowBranding($organisation),
        ];
        
        $pdf = Pdf::loadView('pdf.form-submission', $data);
        $pdf->setPaper('A4', 'portrait');
        
        return $pdf->download('form-submission-' . $submission->id . '-' . date('Y-m-d') . '.pdf');
    }
    
    /**
     * Determine if branding should be shown
     */
    private function shouldShowBranding(Organisation $organisation)
    {
        // Check if organisation is a supporter and has branding disabled
        return !($organisation->is_supporter && $organisation->branding_disabled);
    }
    
    /**
     * Get formatted date range text
     */
    private function getDateRangeText(Request $request)
    {
        if (!$request->filled('start_date') && !$request->filled('end_date')) {
            return 'All records';
        }
        
        $start = $request->filled('start_date') ? date('d/m/Y', strtotime($request->start_date)) : 'Beginning';
        $end = $request->filled('end_date') ? date('d/m/Y', strtotime($request->end_date)) : 'Today';
        
        return "{$start} to {$end}";
    }
}