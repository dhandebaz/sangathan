@extends('layouts.system-admin')

@section('title', 'Organisations')
@section('page-title', 'Organisations')
@section('page-subtitle', 'Manage platform organisations')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Organisations</h1>
            <p class="text-black/70">Manage platform organisations</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <form method="GET" action="{{ route('system-admin.organisations') }}" class="flex items-center space-x-2">
                <input 
                    type="text" 
                    name="search" 
                    value="{{ request('search') }}"
                    class="form-input"
                    placeholder="Search organisations..."
                >
                <button type="submit" class="btn btn-secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Search
                </button>
            </form>
        </div>
    </div>

    <!-- Filter Tabs -->
    <div class="border-b border-black">
        <nav class="-mb-px flex space-x-8">
            <a href="{{ route('system-admin.organisations') }}" 
               class="border-b-2 py-2 px-1 text-sm font-medium {{ !request('status') ? 'border-orange-500 text-black' : 'border-transparent text-black/70 hover:text-black hover:border-black/30' }}">
                All
            </a>
            <a href="{{ route('system-admin.organisations', ['status' => 'active']) }}" 
               class="border-b-2 py-2 px-1 text-sm font-medium {{ request('status') === 'active' ? 'border-orange-500 text-black' : 'border-transparent text-black/70 hover:text-black hover:border-black/30' }}">
                Active
            </a>
            <a href="{{ route('system-admin.organisations', ['status' => 'suspended']) }}" 
               class="border-b-2 py-2 px-1 text-sm font-medium {{ request('status') === 'suspended' ? 'border-orange-500 text-black' : 'border-transparent text-black/70 hover:text-black hover:border-black/30' }}">
                Suspended
            </a>
        </nav>
    </div>

    <!-- Organisations Table -->
    <div class="card">
        <div class="card-body">
            @if($organisations->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Name</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Type</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Users</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Members</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Meetings</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Created</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Status</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Supporter</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($organisations as $organisation)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $organisation->name }}</div>
                                        @if($organisation->email)
                                            <div class="text-sm text-black/70">{{ $organisation->email }}</div>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $organisation->type_display_name }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {{ $organisation->users_count }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {{ $organisation->members_count }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            {{ $organisation->meetings_count }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $organisation->created_at->format('d M Y') }}
                                    </td>
                                    <td class="py-3 px-4">
                                        @if($organisation->is_suspended)
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Suspended
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4">
                                        @if($organisation->is_supporter)
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Yes
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                No
                                            </span>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <a href="{{ route('system-admin.organisations.show', $organisation) }}" class="text-blue-600 hover:text-blue-700 p-1" title="View Details">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                            </a>
                                            
                                            @if($organisation->is_suspended)
                                                <form method="POST" action="{{ route('system-admin.organisations.unsuspend', $organisation) }}" class="inline" onsubmit="return confirm('Are you sure you want to unsuspend this organisation?');">
                                                    @csrf
                                                    <button type="submit" class="text-green-600 hover:text-green-700 p-1" title="Unsuspend">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                            @else
                                                <form method="POST" action="{{ route('system-admin.organisations.suspend', $organisation) }}" class="inline" onsubmit="return confirm('Are you sure you want to suspend this organisation?');">
                                                    @csrf
                                                    <button type="submit" class="text-red-600 hover:text-red-700 p-1" title="Suspend">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                            @endif
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="mt-6">
                    {{ $organisations->appends(request()->query())->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No organisations found</h3>
                    <p class="text-black/70">No organisations match your search criteria.</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection