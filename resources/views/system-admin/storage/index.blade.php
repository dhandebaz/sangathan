@extends('layouts.system-admin')

@section('title', 'Storage Monitoring')
@section('page-title', 'Storage Monitoring')
@section('page-subtitle', 'Platform storage usage overview')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Storage Monitoring</h1>
            <p class="text-black/70">Platform storage usage overview</p>
        </div>
    </div>

    <!-- Storage Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Total Files</p>
                <p class="text-3xl font-bold text-black">{{ number_format($totalFiles) }}</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Estimated Storage</p>
                <p class="text-3xl font-bold text-black">{{ number_format($totalStorage, 2) }} MB</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Average per Org</p>
                <p class="text-3xl font-bold text-black">{{ \App\Models\Organisation::count() > 0 ? number_format($totalStorage / \App\Models\Organisation::count(), 2) : '0.00' }} MB</p>
            </div>
        </div>
    </div>

    <!-- Top Organisations by Storage -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Top 10 Organisations by Estimated Storage Usage</h3>
        </div>
        <div class="card-body">
            @if($organisations->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Organisation</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Type</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Users</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Members</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Meetings</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Forms</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Submissions</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Est. Storage</th>
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
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {{ $organisation->forms_count }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                            {{ $organisation->submissions_count }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black font-semibold">
                                        {{ number_format($organisation->estimated_storage_mb, 2) }} MB
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No storage data</h3>
                    <p class="text-black/70">No organisations have significant storage usage.</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Storage Breakdown -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Storage Usage Breakdown</h3>
        </div>
        <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="text-center p-4 bg-blue-50 rounded-lg border border-black">
                    <p class="text-sm font-medium text-black">Members Data</p>
                    <p class="text-2xl font-bold text-blue-600">{{ number_format(\App\Models\Member::count() * 0.5, 2) }} MB</p>
                    <p class="text-xs text-black/70">{{ \App\Models\Member::count() }} records</p>
                </div>
                <div class="text-center p-4 bg-purple-50 rounded-lg border border-black">
                    <p class="text-sm font-medium text-black">Meetings Data</p>
                    <p class="text-2xl font-bold text-purple-600">{{ number_format(\App\Models\Meeting::count() * 0.1, 2) }} MB</p>
                    <p class="text-xs text-black/70">{{ \App\Models\Meeting::count() }} records</p>
                </div>
                <div class="text-center p-4 bg-indigo-50 rounded-lg border border-black">
                    <p class="text-sm font-medium text-black">Forms Data</p>
                    <p class="text-2xl font-bold text-indigo-600">{{ number_format(\App\Models\Form::count() * 0.2, 2) }} MB</p>
                    <p class="text-xs text-black/70">{{ \App\Models\Form::count() }} records</p>
                </div>
                <div class="text-center p-4 bg-teal-50 rounded-lg border border-black">
                    <p class="text-sm font-medium text-black">Submissions Data</p>
                    <p class="text-2xl font-bold text-teal-600">{{ number_format(\App\Models\FormSubmission::count() * 0.2, 2) }} MB</p>
                    <p class="text-xs text-black/70">{{ \App\Models\FormSubmission::count() }} records</p>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection