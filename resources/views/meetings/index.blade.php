@extends('layouts.app')

@section('title', 'Meetings')
@section('page-title', 'Meeting Register')
@section('page-subtitle', 'Manage your organisation meetings')

@section('content')
<div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Meeting Register</h1>
            <p class="text-black/70">Manage your organisation meetings</p>
        </div>
        
        @can('create', App\Models\Meeting::class)
            <a href="{{ route('meetings.create') }}" class="btn btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Schedule Meeting
            </a>
        @endcan
    </div>

    <!-- Filter Section -->
    <div class="card">
        <div class="card-body">
            <form method="GET" action="{{ route('meetings.index') }}" class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                    <label for="type" class="block text-sm font-medium text-black mb-2">Meeting Type</label>
                    <select name="type" id="type" class="form-input w-full">
                        <option value="">All Types</option>
                        <option value="general" {{ request('type') === 'general' ? 'selected' : '' }}>General Meeting</option>
                        <option value="core" {{ request('type') === 'core' ? 'selected' : '' }}>Core Committee Meeting</option>
                        <option value="emergency" {{ request('type') === 'emergency' ? 'selected' : '' }}>Emergency Meeting</option>
                    </select>
                </div>
                
                <div class="flex items-end">
                    <button type="submit" class="btn btn-secondary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                        </svg>
                        Filter
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Meetings Table -->
    <div class="card">
        <div class="card-body">
            @if($meetings->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Title</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Type</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Date & Time</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Location</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Created By</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Status</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($meetings as $meeting)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $meeting->title }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            @if($meeting->meeting_type === 'general') bg-gray-100 text-gray-800
                                            @elseif($meeting->meeting_type === 'core') bg-orange-100 text-orange-800
                                            @else bg-red-100 text-red-800
                                            @endif">
                                            {{ $meeting->type_display }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <div>{{ $meeting->meeting_date->format('d M Y') }}</div>
                                        <div class="text-sm text-black/70">{{ date('h:i A', strtotime($meeting->meeting_time)) }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $meeting->location ?: 'No location specified' }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $meeting->creator->name }}
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $meeting->status_badge_class }}">
                                            {{ $meeting->status_display }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <a href="{{ route('meetings.show', $meeting) }}" class="text-blue-600 hover:text-blue-700 p-1" title="View Details">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                            </a>
                                            
                                            @can('update', $meeting)
                                                <a href="{{ route('meetings.edit', $meeting) }}" class="text-orange-600 hover:text-orange-700 p-1" title="Edit">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </a>
                                            @endcan
                                            
                                            @can('delete', $meeting)
                                                <form method="POST" action="{{ route('meetings.destroy', $meeting) }}" class="inline" onsubmit="return confirm('Are you sure you want to delete this meeting?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="text-red-600 hover:text-red-700 p-1" title="Delete">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                            @endcan
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="mt-6">
                    {{ $meetings->appends(request()->query())->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No meetings found</h3>
                    <p class="text-black/70 mb-4">Get started by scheduling your first meeting.</p>
                    @can('create', App\Models\Meeting::class)
                        <a href="{{ route('meetings.create') }}" class="btn btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Schedule First Meeting
                        </a>
                    @endcan
                </div>
            @endif
        </div>
    </div>
</div>
@endsection