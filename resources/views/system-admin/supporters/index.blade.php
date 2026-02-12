@extends('layouts.system-admin')

@section('title', 'Supporters')
@section('page-title', 'Supporters Overview')
@section('page-subtitle', 'Platform supporter management')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Supporters Overview</h1>
            <p class="text-black/70">Platform supporter management</p>
        </div>
    </div>

    <!-- Revenue Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Total Supporters</p>
                <p class="text-3xl font-bold text-black">{{ number_format($metrics['total_supporters']) }}</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Active Supporters</p>
                <p class="text-3xl font-bold text-green-600">{{ number_format($metrics['active_supporters']) }}</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Monthly Revenue</p>
                <p class="text-3xl font-bold text-green-600">₹{{ number_format($metrics['monthly_revenue']) }}</p>
                <p class="text-xs text-black/70">₹99 per supporter</p>
            </div>
        </div>
    </div>

    <!-- Supporters Table -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Supporter Organisations</h3>
        </div>
        <div class="card-body">
            @if($supporters->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Name</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Type</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Users</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Members</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Forms</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Since</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Until</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($supporters as $organisation)
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
                                            {{ $organisation->forms_count }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $organisation->supporter_since->format('d M Y') }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        @if($organisation->supporter_until && $organisation->supporter_until->isPast())
                                            <span class="text-red-600">Expired</span>
                                        @elseif($organisation->supporter_until)
                                            {{ $organisation->supporter_until->format('d M Y') }}
                                        @else
                                            <span class="text-black/70">No expiry</span>
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
                                            
                                            <form method="POST" action="{{ route('system-admin.organisations.toggle-supporter', $organisation) }}" class="inline" onsubmit="return confirm('Are you sure you want to remove supporter status from this organisation?');">
                                                @csrf
                                                <button type="submit" class="text-red-600 hover:text-red-700 p-1" title="Remove Supporter Status">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="mt-6">
                    {{ $supporters->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No supporters found</h3>
                    <p class="text-black/70">No organisations have supporter status.</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection