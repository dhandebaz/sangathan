@extends('layouts.system-admin')

@section('title', 'User Details - ' . $user->name)
@section('page-title', 'User Details')
@section('page-subtitle', $user->name)

@section('content')
<div class="space-y-6">
    <!-- User Information -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">User Information</h3>
        </div>
        <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p class="text-sm font-medium text-black">Name</p>
                    <p class="text-black">{{ $user->name }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Email</p>
                    <p class="text-black">{{ $user->email }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Phone</p>
                    <p class="text-black">{{ $user->phone ?? 'Not provided' }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Designation</p>
                    <p class="text-black">{{ $user->designation ?? 'Not provided' }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Created</p>
                    <p class="text-black">{{ $user->created_at->format('d M Y, h:i A') }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Last Login</p>
                    <p class="text-black">
                        @if($user->last_login_at)
                            {{ $user->last_login_at->diffForHumans() }}
                        @else
                            <span class="text-black/70">Never</span>
                        @endif
                    </p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">System Admin</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        @if($user->is_system_admin) bg-red-100 text-red-800
                        @else bg-gray-100 text-gray-800
                        @endif">
                        {{ $user->is_system_admin ? 'Yes' : 'No' }}
                    </span>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Status</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        @if($user->is_disabled) bg-red-100 text-red-800
                        @else bg-green-100 text-green-800
                        @endif">
                        {{ $user->is_disabled ? 'Disabled' : 'Active' }}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Organisations -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Organisations ({{ $user->organisations->count() }})</h3>
        </div>
        <div class="card-body">
            @if($user->organisations->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-2 px-3 font-semibold text-black">Name</th>
                                <th class="text-left py-2 px-3 font-semibold text-black">Type</th>
                                <th class="text-left py-2 px-3 font-semibold text-black">Role</th>
                                <th class="text-left py-2 px-3 font-semibold text-black">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($user->organisations as $organisation)
                                <tr class="border-b border-black/20">
                                    <td class="py-2 px-3 text-black">{{ $organisation->name }}</td>
                                    <td class="py-2 px-3 text-black">{{ $organisation->type_display_name }}</td>
                                    <td class="py-2 px-3 text-black">
                                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                            @if($organisation->pivot->role === 'admin') bg-red-100 text-red-800
                                            @elseif($organisation->pivot->role === 'editor') bg-orange-100 text-orange-800
                                            @else bg-blue-100 text-blue-800
                                            @endif">
                                            {{ ucfirst($organisation->pivot->role) }}
                                        </span>
                                    </td>
                                    <td class="py-2 px-3 text-black">{{ $organisation->pivot->created_at->format('d M Y') }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <p class="text-black/70">This user is not a member of any organisations.</p>
            @endif
        </div>
    </div>

    <!-- Recent Audit Logs -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Recent Activity</h3>
        </div>
        <div class="card-body">
            @if($user->auditLogs->count() > 0)
                <div class="space-y-3">
                    @foreach($user->auditLogs as $log)
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-black/20">
                            <div>
                                <p class="text-sm font-medium text-black">{{ str_replace('_', ' ', ucfirst($log->action)) }}</p>
                                <p class="text-xs text-black/70">{{ $log->created_at->diffForHumans() }}</p>
                            </div>
                            <div class="text-right">
                                <p class="text-xs text-black/70">IP: {{ $log->ip_address ?? 'N/A' }}</p>
                            </div>
                        </div>
                    @endforeach
                </div>
            @else
                <p class="text-black/70">No recent activity found.</p>
            @endif
        </div>
    </div>

    <!-- Actions -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Actions</h3>
        </div>
        <div class="card-body">
            <div class="flex flex-wrap gap-3">
                @if($user->is_disabled)
                    <form method="POST" action="{{ route('system-admin.users.enable', $user) }}" class="inline" onsubmit="return confirm('Are you sure you want to enable this user?');">
                        @csrf
                        <button type="submit" class="btn btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Enable User
                        </button>
                    </form>
                @else
                    <form method="POST" action="{{ route('system-admin.users.disable', $user) }}" class="inline" onsubmit="return confirm('Are you sure you want to disable this user? This will prevent them from logging in.');">
                        @csrf
                        <button type="submit" class="btn btn-danger">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                            </svg>
                            Disable User
                        </button>
                    </form>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection