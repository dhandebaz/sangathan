@extends('layouts.system-admin')

@section('title', 'Audit Logs')
@section('page-title', 'Audit Logs')
@section('page-subtitle', 'System activity logs')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Audit Logs</h1>
            <p class="text-black/70">System activity logs</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <form method="GET" action="{{ route('system-admin.audit-logs') }}" class="flex items-center space-x-2">
                <select name="action" class="form-input">
                    <option value="">All Actions</option>
                    <option value="organisation_suspended" {{ request('action') === 'organisation_suspended' ? 'selected' : '' }}>Org Suspended</option>
                    <option value="organisation_unsuspended" {{ request('action') === 'organisation_unsuspended' ? 'selected' : '' }}>Org Unsuspended</option>
                    <option value="user_disabled" {{ request('action') === 'user_disabled' ? 'selected' : '' }}>User Disabled</option>
                    <option value="user_enabled" {{ request('action') === 'user_enabled' ? 'selected' : '' }}>User Enabled</option>
                    <option value="supporter_status_toggled" {{ request('action') === 'supporter_status_toggled' ? 'selected' : '' }}>Supporter Toggled</option>
                    <option value="form_disabled" {{ request('action') === 'form_disabled' ? 'selected' : '' }}>Form Disabled</option>
                    <option value="form_enabled" {{ request('action') === 'form_enabled' ? 'selected' : '' }}>Form Enabled</option>
                </select>
                <button type="submit" class="btn btn-secondary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                    </svg>
                    Filter
                </button>
            </form>
        </div>
    </div>

    <!-- Audit Logs Table -->
    <div class="card">
        <div class="card-body">
            @if($auditLogs->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Time</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Actor</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Action</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Target</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Details</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">IP Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($auditLogs as $log)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div>{{ $log->created_at->format('d M Y') }}</div>
                                        <div class="text-sm text-black/70">{{ $log->created_at->format('H:i') }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        @if($log->actor)
                                            <div class="font-medium">{{ $log->actor->name }}</div>
                                            <div class="text-sm text-black/70">{{ $log->actor->email }}</div>
                                        @else
                                            <span class="text-black/70">Unknown</span>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            @if(str_contains($log->action, 'suspend') || str_contains($log->action, 'disable')) bg-red-100 text-red-800
                                            @elseif(str_contains($log->action, 'unsuspend') || str_contains($log->action, 'enable')) bg-green-100 text-green-800
                                            @else bg-blue-100 text-blue-800
                                            @endif">
                                            {{ str_replace('_', ' ', ucfirst($log->action)) }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        @if($log->target_type && $log->target_id)
                                            <div class="font-medium">{{ $log->target_type }} #{{ $log->target_id }}</div>
                                        @else
                                            <span class="text-black/70">N/A</span>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        @if($log->metadata)
                                            <div class="text-sm">
                                                @if(isset($log->metadata['reason']))
                                                    <div><strong>Reason:</strong> {{ $log->metadata['reason'] }}</div>
                                                @endif
                                                @if(isset($log->metadata['new_status']))
                                                    <div><strong>New Status:</strong> {{ $log->metadata['new_status'] }}</div>
                                                @endif
                                            </div>
                                        @else
                                            <span class="text-black/70">No details</span>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <code class="text-xs">{{ $log->ip_address ?? 'N/A' }}</code>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="mt-6">
                    {{ $auditLogs->appends(request()->query())->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No audit logs found</h3>
                    <p class="text-black/70">No system activity logs match your criteria.</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection