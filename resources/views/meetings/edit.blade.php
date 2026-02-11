@extends('layouts.app')

@section('title', 'Edit Meeting')
@section('page-title', 'Edit Meeting')
@section('page-subtitle', 'Update meeting details')

@section('content')
<div class="max-w-4xl mx-auto">
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Meeting Details</h3>
        </div>
        
        <form method="POST" action="{{ route('meetings.update', $meeting) }}" class="card-body space-y-6">
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
            
            <!-- Title -->
            <div>
                <label for="title" class="block text-sm font-medium text-black mb-2">
                    Meeting Title *
                </label>
                <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    value="{{ old('title', $meeting->title) }}"
                    required 
                    autofocus
                    class="form-input w-full @error('title') border-red-500 @enderror"
                    placeholder="Enter meeting title"
                >
                @error('title')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Meeting Type -->
                <div>
                    <label for="meeting_type" class="block text-sm font-medium text-black mb-2">
                        Meeting Type *
                    </label>
                    <select 
                        name="meeting_type" 
                        id="meeting_type" 
                        required 
                        class="form-input w-full @error('meeting_type') border-red-500 @enderror"
                    >
                        <option value="">Select meeting type</option>
                        <option value="general" {{ old('meeting_type', $meeting->meeting_type) === 'general' ? 'selected' : '' }}>General Meeting</option>
                        <option value="core" {{ old('meeting_type', $meeting->meeting_type) === 'core' ? 'selected' : '' }}>Core Committee Meeting</option>
                        <option value="emergency" {{ old('meeting_type', $meeting->meeting_type) === 'emergency' ? 'selected' : '' }}>Emergency Meeting</option>
                    </select>
                    @error('meeting_type')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <!-- Location -->
                <div>
                    <label for="location" class="block text-sm font-medium text-black mb-2">
                        Location
                    </label>
                    <input 
                        type="text" 
                        name="location" 
                        id="location" 
                        value="{{ old('location', $meeting->location) }}"
                        class="form-input w-full @error('location') border-red-500 @enderror"
                        placeholder="Meeting location (optional)"
                    >
                    @error('location')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Meeting Date -->
                <div>
                    <label for="meeting_date" class="block text-sm font-medium text-black mb-2">
                        Meeting Date *
                    </label>
                    <input 
                        type="date" 
                        name="meeting_date" 
                        id="meeting_date" 
                        value="{{ old('meeting_date', $meeting->meeting_date->format('Y-m-d')) }}"
                        required 
                        min="{{ date('Y-m-d') }}"
                        class="form-input w-full @error('meeting_date') border-red-500 @enderror"
                    >
                    @error('meeting_date')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
                
                <!-- Meeting Time -->
                <div>
                    <label for="meeting_time" class="block text-sm font-medium text-black mb-2">
                        Meeting Time *
                    </label>
                    <input 
                        type="time" 
                        name="meeting_time" 
                        id="meeting_time" 
                        value="{{ old('meeting_time', $meeting->meeting_time) }}"
                        required 
                        class="form-input w-full @error('meeting_time') border-red-500 @enderror"
                    >
                    @error('meeting_time')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>
            
            <!-- Attendees -->
            <div>
                <label for="attendees" class="block text-sm font-medium text-black mb-2">
                    Attendees
                </label>
                <div class="border border-black rounded-lg p-4 max-h-60 overflow-y-auto">
                    @if($members->count() > 0)
                        <div class="space-y-2">
                            @foreach($members as $member)
                                <label class="flex items-center space-x-3 cursor-pointer hover:bg-orange-50 p-2 rounded">
                                    <input 
                                        type="checkbox" 
                                        name="attendees[]" 
                                        value="{{ $member->id }}"
                                        {{ in_array($member->id, old('attendees', $selectedAttendees)) ? 'checked' : '' }}
                                        class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    >
                                    <div class="flex-1">
                                        <span class="text-black font-medium">{{ $member->full_name }}</span>
                                        <span class="text-black/70 text-sm ml-2">({{ $member->role }})</span>
                                        <div class="text-xs text-black/60">{{ $member->phone_number }}</div>
                                    </div>
                                </label>
                            @endforeach
                        </div>
                    @else
                        <p class="text-black/70">No active members available. Please add members first.</p>
                    @endif
                </div>
                @error('attendees')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
                @error('attendees.*')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Agenda -->
            <div>
                <label for="agenda" class="block text-sm font-medium text-black mb-2">
                    Agenda *
                </label>
                <textarea 
                    name="agenda" 
                    id="agenda" 
                    rows="4"
                    required 
                    class="form-input w-full @error('agenda') border-red-500 @enderror"
                    placeholder="Meeting agenda and discussion points"
                >{{ old('agenda', $meeting->agenda) }}</textarea>
                @error('agenda')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Decisions -->
            <div>
                <label for="decisions" class="block text-sm font-medium text-black mb-2">
                    Decisions (optional)
                </label>
                <textarea 
                    name="decisions" 
                    id="decisions" 
                    rows="3"
                    class="form-input w-full @error('decisions') border-red-500 @enderror"
                    placeholder="Key decisions made during the meeting (can be updated later)"
                >{{ old('decisions', $meeting->decisions) }}</textarea>
                @error('decisions')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Action Points -->
            <div>
                <label for="action_points" class="block text-sm font-medium text-black mb-2">
                    Action Points (optional)
                </label>
                <textarea 
                    name="action_points" 
                    id="action_points" 
                    rows="3"
                    class="form-input w-full @error('action_points') border-red-500 @enderror"
                    placeholder="Action items and follow-up tasks (can be updated later)"
                >{{ old('action_points', $meeting->action_points) }}</textarea>
                @error('action_points')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-4">
                <a href="{{ route('meetings.show', $meeting) }}" class="btn btn-secondary">
                    Cancel
                </a>
                <button type="submit" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Update Meeting
                </button>
            </div>
        </form>
    </div>
</div>
@endsection