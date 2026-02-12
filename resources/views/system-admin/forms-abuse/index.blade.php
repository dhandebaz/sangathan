@extends('layouts.system-admin')

@section('title', 'Forms Abuse Monitoring')
@section('page-title', 'Forms Abuse Monitoring')
@section('page-subtitle', 'Monitor high-activity forms for potential abuse')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Forms Abuse Monitoring</h1>
            <p class="text-black/70">Monitor high-activity forms for potential abuse</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <div class="text-sm text-black/70">
                Recent Activity: <span class="font-medium text-black">{{ $recentActivity }} submissions in last hour</span>
            </div>
        </div>
    </div>

    <!-- Abuse Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Forms Flagged</p>
                <p class="text-3xl font-bold text-red-600">{{ $abusiveForms->total() }}</p>
                <p class="text-xs text-black/70">>50 submissions in 24h</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Total Forms</p>
                <p class="text-3xl font-bold text-black">{{ \App\Models\Form::count() }}</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Public Forms</p>
                <p class="text-3xl font-bold text-black">{{ \App\Models\Form::where('is_public', true)->count() }}</p>
            </div>
        </div>
    </div>

    <!-- Flagged Forms -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Flagged Forms (>50 submissions in 24h)</h3>
        </div>
        <div class="card-body">
            @if($abusiveForms->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Form</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Organisation</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">24h Submissions</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Status</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Created</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($abusiveForms as $form)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $form->title }}</div>
                                        @if($form->description)
                                            <div class="text-sm text-black/70">{{ Str::limit($form->description, 50) }}</div>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $form->organisation->name }}</div>
                                        <div class="text-sm text-black/70">{{ $form->organisation->type_display_name }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            {{ $form->submission_count }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        @if($form->is_disabled)
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
                                        {{ $form->created_at->format('d M Y') }}
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <a href="{{ route('system-admin.organisations.show', $form->organisation) }}" class="text-blue-600 hover:text-blue-700 p-1" title="View Organisation">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                                                </svg>
                                            </a>
                                            
                                            @if($form->is_disabled)
                                                <form method="POST" action="{{ route('system-admin.forms.enable', $form) }}" class="inline" onsubmit="return confirm('Are you sure you want to enable this form?');">
                                                    @csrf
                                                    <button type="submit" class="text-green-600 hover:text-green-700 p-1" title="Enable Form">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                            @else
                                                <form method="POST" action="{{ route('system-admin.forms.disable', $form) }}" class="inline" onsubmit="return confirm('Are you sure you want to disable this form? This will prevent new submissions.');">
                                                    @csrf
                                                    <button type="submit" class="text-red-600 hover:text-red-700 p-1" title="Disable Form">
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
                    {{ $abusiveForms->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No flagged forms</h3>
                    <p class="text-black/70">No forms have been flagged for high submission activity.</p>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection