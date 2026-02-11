@extends('layouts.app')

@section('title', 'Members')
@section('page-title', 'Member Register')
@section('page-subtitle', 'Manage your organisation members')

@section('content')
<div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Member Register</h1>
            <p class="text-black/70">Manage your organisation members</p>
        </div>
        
        <div class="flex items-center gap-3">
            <a href="{{ route('export.members.pdf') }}" class="btn btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export PDF
            </a>
            
            @can('create', App\Models\Member::class)
                <a href="{{ route('members.create') }}" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Member
                </a>
            @endcan
        </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="card">
        <div class="card-body">
            <form method="GET" action="{{ route('members.index') }}" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label for="search" class="block text-sm font-medium text-black mb-2">Search</label>
                        <input 
                            type="text" 
                            name="search" 
                            id="search" 
                            value="{{ request('search') }}"
                            class="form-input w-full"
                            placeholder="Search by name or phone..."
                        >
                    </div>
                    
                    <div>
                        <label for="status" class="block text-sm font-medium text-black mb-2">Status</label>
                        <select name="status" id="status" class="form-input w-full">
                            <option value="">All Status</option>
                            <option value="active" {{ request('status') === 'active' ? 'selected' : '' }}>Active</option>
                            <option value="inactive" {{ request('status') === 'inactive' ? 'selected' : '' }}>Inactive</option>
                        </select>
                    </div>
                    
                    <div class="flex items-end">
                        <button type="submit" class="btn btn-secondary w-full">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            Search
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Members Table -->
    <div class="card">
        <div class="card-body">
            @if($members->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Name</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Phone</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Role</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Area</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Joining Date</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Status</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($members as $member)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $member->full_name }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $member->formatted_phone }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $member->role }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $member->area_or_district }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $member->joining_date->format('d M Y') }}
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $member->status_badge_class }}">
                                            {{ $member->status_display }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            @can('update', $member)
                                                <a href="{{ route('members.edit', $member) }}" class="text-orange-600 hover:text-orange-700 p-1">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </a>
                                            @endcan
                                            
                                            @can('toggleStatus', $member)
                                                <form method="POST" action="{{ route('members.toggle-status', $member) }}" class="inline">
                                                    @csrf
                                                    <button type="submit" class="text-blue-600 hover:text-blue-700 p-1" title="{{ $member->status === 'active' ? 'Deactivate' : 'Activate' }}">
                                                        @if($member->status === 'active')
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                                            </svg>
                                                        @else
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                            </svg>
                                                        @endif
                                                    </button>
                                                </form>
                                            @endcan
                                            
                                            @can('delete', $member)
                                                <form method="POST" action="{{ route('members.destroy', $member) }}" class="inline" onsubmit="return confirm('Are you sure you want to delete this member?');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="text-red-600 hover:text-red-700 p-1">
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
                    {{ $members->appends(request()->query())->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No members found</h3>
                    <p class="text-black/70 mb-4">Get started by adding your first member.</p>
                    @can('create', App\Models\Member::class)
                        <a href="{{ route('members.create') }}" class="btn btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add First Member
                        </a>
                    @endcan
                </div>
            @endif
        </div>
    </div>
</div>
@endsection