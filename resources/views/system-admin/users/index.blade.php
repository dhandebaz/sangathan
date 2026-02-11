@extends('layouts.system-admin')

@section('title', 'Users')
@section('page-title', 'Platform Users')
@section('page-subtitle', 'Manage platform users')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Platform Users</h1>
            <p class="text-black/70">Manage platform users</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <form method="GET" action="{{ route('system-admin.users') }}" class="flex items-center space-x-2">
                <input 
                    type="text" 
                    name="search" 
                    value="{{ request('search') }}"
                    class="form-input"
                    placeholder="Search users..."
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
            <a href="{{ route('system-admin.users') }}" 
               class="border-b-2 py-2 px-1 text-sm font-medium {{ !request('status') ? 'border-orange-500 text-black' : 'border-transparent text-black/70 hover:text-black hover:border-black/30' }}">
                All
            </a>
            <a href="{{ route('system-admin.users', ['status' => 'active']) }}" 
               class="border-b-2 py-2 px-1 text-sm font-medium {{ request('status') === 'active' ? 'border-orange-500 text-black' : 'border-transparent text-black/70 hover:text-black hover:border-black/30' }}">
                Active
            </a>
            <a href="{{ route('system-admin.users', ['status' => 'disabled']) }}" 
               class="border-b-2 py-2 px-1 text-sm font-medium {{ request('status') === 'disabled' ? 'border-orange-500 text-black' : 'border-transparent text-black/70 hover:text-black hover:border-black/30' }}">
                Disabled
            </a>
        </nav>
    </div>

    <!-- Users Table -->
    <div class="card">
        <div class="card-body">
            @if($users->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Name</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Email</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Organisations</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">System Admin</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Status</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Created</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Last Login</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($users as $user)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $user->name }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $user->email }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {{ $user->organisations->count() }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        @if($user->is_system_admin)
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Yes
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                No
                                            </span>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4">
                                        @if($user->is_disabled)
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Disabled
                                            </span>
                                        @else
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $user->created_at->format('d M Y') }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        @if($user->last_login_at)
                                            {{ $user->last_login_at->diffForHumans() }}
                                        @else
                                            <span class="text-black/70">Never</span>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <a href="{{ route('system-admin.users.show', $user) }}" class="text-blue-600 hover:text-blue-700 p-1" title="View Details">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                            </a>
                                            
                                            @if($user->is_disabled)
                                                <form method="POST" action="{{ route('system-admin.users.enable', $user) }}" class="inline" onsubmit="return confirm('Are you sure you want to enable this user?');">
                                                    @csrf
                                                    <button type="submit" class="text-green-600 hover:text-green-700 p-1" title="Enable">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                            @else
                                                <form method="POST" action="{{ route('system-admin.users.disable', $user) }}" class="inline" onsubmit="return confirm('Are you sure you want to disable this user?');">
                                                    @csrf
                                                    <button type="submit" class="text-red-600 hover:text-red-700 p-1" title="Disable">
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
                    {{ $users->appends(request()->query())->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No users found</h3>
                    <p class="text-black/70">No users match your search criteria.</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection