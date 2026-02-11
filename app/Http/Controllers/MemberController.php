<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    /**
     * Display a listing of the members.
     */
    public function index(Request $request)
    {
        $organisationId = session('current_organisation_id');
        
        $query = Member::forOrganisation($organisationId);
        
        // Search functionality
        if ($request->filled('search')) {
            $query->search($request->search);
        }
        
        // Status filter
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->active();
            } elseif ($request->status === 'inactive') {
                $query->inactive();
            }
        }
        
        $members = $query->orderBy('full_name')->paginate(20);
        
        return view('members.index', compact('members'));
    }

    /**
     * Show the form for creating a new member.
     */
    public function create()
    {
        return view('members.create');
    }

    /**
     * Store a newly created member in storage.
     */
    public function store(Request $request)
    {
        $validator = $this->validateMember($request);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        $organisationId = session('current_organisation_id');
        
        // Check for duplicate phone number within the organisation
        $existingMember = Member::forOrganisation($organisationId)
            ->where('phone_number', $request->phone_number)
            ->first();
            
        if ($existingMember) {
            return back()->withErrors(['phone_number' => 'A member with this phone number already exists in your organisation.'])->withInput();
        }
        
        Member::create([
            'organisation_id' => $organisationId,
            'full_name' => $request->full_name,
            'phone_number' => $request->phone_number,
            'role' => $request->role,
            'area_or_district' => $request->area_or_district,
            'joining_date' => $request->joining_date,
            'status' => $request->status ?? 'active',
            'notes' => $request->notes,
        ]);
        
        return redirect()->route('members.index')->with('success', 'Member added successfully.');
    }

    /**
     * Show the form for editing the specified member.
     */
    public function edit(Member $member)
    {
        $this->authorize('update', $member);
        
        return view('members.edit', compact('member'));
    }

    /**
     * Update the specified member in storage.
     */
    public function update(Request $request, Member $member)
    {
        $this->authorize('update', $member);
        
        $validator = $this->validateMember($request, $member->id);
        
        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }
        
        // Check for duplicate phone number within the organisation (excluding current member)
        $existingMember = Member::forOrganisation($member->organisation_id)
            ->where('phone_number', $request->phone_number)
            ->where('id', '!=', $member->id)
            ->first();
            
        if ($existingMember) {
            return back()->withErrors(['phone_number' => 'A member with this phone number already exists in your organisation.'])->withInput();
        }
        
        $member->update([
            'full_name' => $request->full_name,
            'phone_number' => $request->phone_number,
            'role' => $request->role,
            'area_or_district' => $request->area_or_district,
            'joining_date' => $request->joining_date,
            'status' => $request->status ?? 'active',
            'notes' => $request->notes,
        ]);
        
        return redirect()->route('members.index')->with('success', 'Member updated successfully.');
    }

    /**
     * Remove the specified member from storage.
     */
    public function destroy(Member $member)
    {
        $this->authorize('delete', $member);
        
        $member->delete();
        
        return redirect()->route('members.index')->with('success', 'Member deleted successfully.');
    }

    /**
     * Toggle member status.
     */
    public function toggleStatus(Member $member)
    {
        $this->authorize('update', $member);
        
        $member->status = $member->status === 'active' ? 'inactive' : 'active';
        $member->save();
        
        return back()->with('success', 'Member status updated successfully.');
    }

    /**
     * Validate member data.
     */
    protected function validateMember(Request $request, $ignoreId = null)
    {
        $rules = [
            'full_name' => 'required|string|max:255',
            'phone_number' => [
                'required',
                'string',
                'max:15',
                $this->phoneNumberRule(),
            ],
            'role' => 'required|string|max:100',
            'area_or_district' => 'required|string|max:255',
            'joining_date' => 'required|date|before_or_equal:today',
            'status' => 'sometimes|in:active,inactive',
            'notes' => 'nullable|string|max:1000',
        ];
        
        $messages = [
            'full_name.required' => 'Full name is required.',
            'phone_number.required' => 'Phone number is required.',
            'phone_number.regex' => 'Please enter a valid Indian phone number.',
            'role.required' => 'Role is required.',
            'area_or_district.required' => 'Area or district is required.',
            'joining_date.required' => 'Joining date is required.',
            'joining_date.before_or_equal' => 'Joining date cannot be in the future.',
        ];
        
        return Validator::make($request->all(), $rules, $messages);
    }

    /**
     * Phone number validation rule for Indian format.
     */
    protected function phoneNumberRule()
    {
        return Rule::regex('/^[6-9]\d{9}$|^\+91[6-9]\d{9}$/');
    }
}