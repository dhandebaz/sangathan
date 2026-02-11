@extends('layouts.app')

@section('title', 'Edit Member')
@section('page-title', 'Edit Member')
@section('page-subtitle', 'Update member information')

@section('content')
<div class="max-w-2xl mx-auto">
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Member Information</h3>
        </div>
        
        <form method="POST" action="{{ route('members.update', $member) }}" class="card-body space-y-6">
            @csrf
            @method('PUT')
            
            @if ($errors->any())
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <ul class="list-disc list-inside">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            
            <!-- Full Name -->
            <div>
                <label for="full_name" class="block text-sm font-medium text-black mb-2">
                    Full Name *
                </label>
                <input 
                    type="text" 
                    name="full_name" 
                    id="full_name" 
                    value="{{ old('full_name', $member->full_name) }}"
                    required 
                    autofocus
                    class="form-input w-full @error('full_name') border-red-500 @enderror"
                    placeholder="Enter member's full name"
                >
                @error('full_name')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Phone Number -->
            <div>
                <label for="phone_number" class="block text-sm font-medium text-black mb-2">
                    Phone Number *
                </label>
                <input 
                    type="tel" 
                    name="phone_number" 
                    id="phone_number" 
                    value="{{ old('phone_number', $member->phone_number) }}"
                    required 
                    class="form-input w-full @error('phone_number') border-red-500 @enderror"
                    placeholder="Enter 10-digit phone number"
                    pattern="[6-9]\d{9}"
                    title="Please enter a valid 10-digit Indian phone number starting with 6-9"
                >
                <p class="mt-1 text-sm text-black/70">Enter 10-digit number (e.g., 9876543210)</p>
                @error('phone_number')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Role -->
            <div>
                <label for="role" class="block text-sm font-medium text-black mb-2">
                    Role *
                </label>
                <input 
                    type="text" 
                    name="role" 
                    id="role" 
                    value="{{ old('role', $member->role) }}"
                    required 
                    class="form-input w-full @error('role') border-red-500 @enderror"
                    placeholder="Member's role in organisation"
                >
                @error('role')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Area or District -->
            <div>
                <label for="area_or_district" class="block text-sm font-medium text-black mb-2">
                    Area or District *
                </label>
                <input 
                    type="text" 
                    name="area_or_district" 
                    id="area_or_district" 
                    value="{{ old('area_or_district', $member->area_or_district) }}"
                    required 
                    class="form-input w-full @error('area_or_district') border-red-500 @enderror"
                    placeholder="Member's area or district"
                >
                @error('area_or_district')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Joining Date -->
            <div>
                <label for="joining_date" class="block text-sm font-medium text-black mb-2">
                    Joining Date *
                </label>
                <input 
                    type="date" 
                    name="joining_date" 
                    id="joining_date" 
                    value="{{ old('joining_date', $member->joining_date->format('Y-m-d')) }}"
                    required 
                    max="{{ date('Y-m-d') }}"
                    class="form-input w-full @error('joining_date') border-red-500 @enderror"
                >
                @error('joining_date')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Status -->
            <div>
                <label for="status" class="block text-sm font-medium text-black mb-2">
                    Status
                </label>
                <select name="status" id="status" class="form-input w-full @error('status') border-red-500 @enderror">
                    <option value="active" {{ old('status', $member->status) === 'active' ? 'selected' : '' }}>Active</option>
                    <option value="inactive" {{ old('status', $member->status) === 'inactive' ? 'selected' : '' }}>Inactive</option>
                </select>
                @error('status')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Notes -->
            <div>
                <label for="notes" class="block text-sm font-medium text-black mb-2">
                    Notes
                </label>
                <textarea 
                    name="notes" 
                    id="notes" 
                    rows="3"
                    class="form-input w-full @error('notes') border-red-500 @enderror"
                    placeholder="Additional notes about the member (optional)"
                >{{ old('notes', $member->notes) }}</textarea>
                @error('notes')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-4">
                <a href="{{ route('members.index') }}" class="btn btn-secondary">
                    Cancel
                </a>
                <button type="submit" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Update Member
                </button>
            </div>
        </form>
    </div>
</div>
@endsection