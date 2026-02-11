@extends('layouts.app')

@section('title', $meeting->title)
@section('page-title', $meeting->title)
@section('page-subtitle', $meeting->formatted_date_time)

@section('content')
<div class="space-y-6">
    <!-- Meeting Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">{{ $meeting->title }}</h1>
            <p class="text-black/70">{{ $meeting->formatted_date_time }}</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <a href="{{ route('export.meeting.minutes.pdf', $meeting) }}" class="btn btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export Minutes PDF
            </a>
            
            @can('update', $meeting)
                <a href="{{ route('meetings.edit', $meeting) }}" class="btn btn-secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                    Edit
                </a>
            @endcan
            
            @can('delete', $meeting)
                <form method="POST" action="{{ route('meetings.destroy', $meeting) }}" class="inline" onsubmit="return confirm('Are you sure you want to delete this meeting?');">
                    @csrf
                    @method('DELETE')
                    <button type="submit" class="btn btn-danger">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                        Delete
                    </button>
                </form>
            @endcan
        </div>
    </div>

    <!-- Meeting Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Meeting Information -->
        <div class="space-y-6">
            <!-- Basic Details -->
            <div class="card">
                <div class="card-header">
                    <h3 class="text-lg font-medium text-black">Meeting Details</h3>
                </div>
                <div class="card-body space-y-4">
                    <div>
                        <p class="text-sm font-medium text-black">Type</p>
                        <p class="text-black">{{ $meeting->type_display }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-black">Date & Time</p>
                        <p class="text-black">{{ $meeting->formatted_date_time }}</p>
                    </div>
                    @if($meeting->location)
                        <div>
                            <p class="text-sm font-medium text-black">Location</p>
                            <p class="text-black">{{ $meeting->location }}</p>
                        </div>
                    @endif
                    <div>
                        <p class="text-sm font-medium text-black">Created By</p>
                        <p class="text-black">{{ $meeting->creator->name }}</p>
                    </div>
                </div>
            </div>

            <!-- Attendees -->
            <div class="card">
                <div class="card-header">
                    <h3 class="text-lg font-medium text-black">Attendees ({{ $meeting->attendees->count() }})</h3>
                </div>
                <div class="card-body">
                    @if($meeting->attendees->count() > 0)
                        <div class="space-y-3">
                            @foreach($meeting->attendees as $attendee)
                                <div class="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                                    <div class="avatar-sm">{{ substr($attendee->full_name, 0, 2) }}</div>
                                    <div class="flex-1">
                                        <p class="font-medium text-black">{{ $attendee->full_name }}</p>
                                        <p class="text-sm text-black/70">{{ $attendee->role }}</p>
                                        <p class="text-xs text-black/60">{{ $attendee->phone_number }}</p>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <p class="text-black/70">No attendees selected for this meeting.</p>
                    @endif
                </div>
            </div>
        </div>

        <!-- Agenda and Meeting Content -->
        <div class="space-y-6">
            <!-- Agenda -->
            <div class="card">
                <div class="card-header">
                    <h3 class="text-lg font-medium text-black">Agenda</h3>
                </div>
                <div class="card-body">
                    <div class="text-black whitespace-pre-wrap">{{ $meeting->agenda }}</div>
                </div>
            </div>

            <!-- Decisions -->
            @if($meeting->decisions)
                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-medium text-black">Decisions</h3>
                    </div>
                    <div class="card-body">
                        <div class="text-black whitespace-pre-wrap">{{ $meeting->decisions }}</div>
                    </div>
                </div>
            @endif

            <!-- Action Points -->
            @if($meeting->action_points)
                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-medium text-black">Action Points</h3>
                    </div>
                    <div class="card-body">
                        <div class="text-black whitespace-pre-wrap">{{ $meeting->action_points }}</div>
                    </div>
                </div>
            @endif
        </div>
    </div>

    <!-- Video Meeting Section -->
    @if($meeting->is_upcoming)
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">Video Meeting</h3>
            </div>
            <div class="card-body">
                <div class="space-y-4">
                    <p class="text-black/70">Join the video meeting using the button below. The meeting room will open in a new tab.</p>
                    
                    <div class="flex items-center space-x-4">
                        <button 
                            onclick="startJitsiMeeting()" 
                            class="btn btn-primary"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Start Video Meeting
                        </button>
                        
                        <button 
                            onclick="joinJitsiMeeting()" 
                            class="btn btn-secondary"
                        >
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Join Video Meeting
                        </button>
                    </div>
                    
                    <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <p class="text-sm text-black">
                            <strong>Meeting Room:</strong> {{ $meeting->jitsi_room_name }}<br>
                            <strong>Platform:</strong> Jitsi Meet (public infrastructure)<br>
                            <strong>Access:</strong> No authentication required for video
                        </p>
                    </div>
                </div>
            </div>
        </div>
    @endif
</div>

@push('scripts')
<script>
function startJitsiMeeting() {
    const roomName = '{{ $meeting->jitsi_room_name }}';
    const jitsiUrl = `https://meet.jit.si/${roomName}`;
    window.open(jitsiUrl, '_blank', 'width=1200,height=800');
}

function joinJitsiMeeting() {
    const roomName = '{{ $meeting->jitsi_room_name }}';
    const jitsiUrl = `https://meet.jit.si/${roomName}`;
    window.open(jitsiUrl, '_blank', 'width=1200,height=800');
}
</script>
@endpush
@endsection