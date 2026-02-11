<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MeetingController extends Controller
{
    /**
     * Display a listing of the meetings.
     */
    public function index(Request $request)
    {
        $organisationId = session('current_organisation_id');
        
        $query = Meeting::forOrganisation($organisationId)
                       ->with(['creator', 'attendees'])
                       ->orderByDate('desc');
        
        // Filter by meeting type
        if ($request->filled('type')) {
            $query->byType($request->type);
        }
        
        $meetings = $query->paginate(15);
        
        return view('meetings.index', compact('meetings'));
    }

    /**
     * Show the form for creating a new meeting.
     */
    public function create()
    {
        $organisationId = session('current_organisation_id');
        $members = Member::forOrganisation($organisationId)
                        ->active()
                        ->orderBy('full_name')
                        ->get();
        
        return view('meetings.create', compact('members'));
    }

    /**
     * Store a newly created meeting in storage.
     */
    public function store(Request $request)
    {
        $validator = $this->validateMeeting($request);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        $organisationId = session('current_organisation_id');
        
        $meeting = Meeting::create([
            'organisation_id' => $organisationId,
            'title' => $request->title,
            'meeting_type' => $request->meeting_type,
            'meeting_date' => $request->meeting_date,
            'meeting_time' => $request->meeting_time,
            'location' => $request->location,
            'agenda' => $request->agenda,
            'decisions' => $request->decisions,
            'action_points' => $request->action_points,
            'created_by' => auth()->id(),
        ]);
        
        // Attach attendees
        if ($request->has('attendees')) {
            $meeting->attendees()->attach($request->attendees);
        }
        
        return redirect()->route('meetings.show', $meeting)->with('success', 'Meeting created successfully.');
    }

    /**
     * Display the specified meeting.
     */
    public function show(Meeting $meeting)
    {
        $this->authorize('view', $meeting);
        
        $meeting->load(['creator', 'attendees']);
        
        return view('meetings.show', compact('meeting'));
    }

    /**
     * Show the form for editing the specified meeting.
     */
    public function edit(Meeting $meeting)
    {
        $this->authorize('update', $meeting);
        
        $organisationId = session('current_organisation_id');
        $members = Member::forOrganisation($organisationId)
                        ->active()
                        ->orderBy('full_name')
                        ->get();
        
        $selectedAttendees = $meeting->attendees->pluck('id')->toArray();
        
        return view('meetings.edit', compact('meeting', 'members', 'selectedAttendees'));
    }

    /**
     * Update the specified meeting in storage.
     */
    public function update(Request $request, Meeting $meeting)
    {
        $this->authorize('update', $meeting);
        
        $validator = $this->validateMeeting($request);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        $meeting->update([
            'title' => $request->title,
            'meeting_type' => $request->meeting_type,
            'meeting_date' => $request->meeting_date,
            'meeting_time' => $request->meeting_time,
            'location' => $request->location,
            'agenda' => $request->agenda,
            'decisions' => $request->decisions,
            'action_points' => $request->action_points,
        ]);
        
        // Sync attendees
        if ($request->has('attendees')) {
            $meeting->attendees()->sync($request->attendees);
        } else {
            $meeting->attendees()->detach();
        }
        
        return redirect()->route('meetings.show', $meeting)->with('success', 'Meeting updated successfully.');
    }

    /**
     * Remove the specified meeting from storage.
     */
    public function destroy(Meeting $meeting)
    {
        $this->authorize('delete', $meeting);
        
        $meeting->delete();
        
        return redirect()->route('meetings.index')->with('success', 'Meeting deleted successfully.');
    }

    /**
     * Validate meeting data.
     */
    protected function validateMeeting(Request $request)
    {
        $rules = [
            'title' => 'required|string|max:255',
            'meeting_type' => 'required|in:general,core,emergency',
            'meeting_date' => 'required|date',
            'meeting_time' => 'required|date_format:H:i',
            'location' => 'nullable|string|max:500',
            'agenda' => 'required|string|max:5000',
            'decisions' => 'nullable|string|max:5000',
            'action_points' => 'nullable|string|max:5000',
            'attendees' => 'nullable|array',
            'attendees.*' => 'exists:members,id',
        ];
        
        $messages = [
            'title.required' => 'Meeting title is required.',
            'meeting_type.required' => 'Meeting type is required.',
            'meeting_date.required' => 'Meeting date is required.',
            'meeting_time.required' => 'Meeting time is required.',
            'agenda.required' => 'Meeting agenda is required.',
            'attendees.*.exists' => 'Selected attendee is invalid.',
        ];
        
        return Validator::make($request->all(), $rules, $messages);
    }
}