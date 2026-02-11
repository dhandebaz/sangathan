@extends('layouts.app')

@section('title', 'Submission Details')
@section('page-title', 'Submission Details')
@section('page-subtitle', $form->title)

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Submission Details</h1>
            <p class="text-black/70">{{ $form->title }}</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <a href="{{ route('export.submission.pdf', $submission) }}" class="btn btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export PDF
            </a>
            
            <a href="{{ route('forms.submissions.index', $form) }}" class="btn btn-secondary">
                Back to Submissions
            </a>
            
            @if($submission->canConvertToMember())
                <form method="POST" action="{{ route('forms.submissions.convert-to-member', [$form, $submission]) }}" class="inline" onsubmit="return confirm('Convert this submission to a member? This will create a new member record.');">
                    @csrf
                    <button type="submit" class="btn btn-primary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                        </svg>
                        Convert to Member
                    </button>
                </form>
            @endif
        </div>
    </div>

    <!-- Submission Info -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Submission Information</h3>
        </div>
        <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <p class="text-sm font-medium text-black">Submitted</p>
                    <p class="text-black">{{ $submission->submitted_at->format('d M Y, h:i A') }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">IP Address</p>
                    <p class="text-black">
                        <code class="text-sm">{{ $submission->submitter_ip ?? 'N/A' }}</code>
                    </p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Total Fields</p>
                    <p class="text-black">{{ $submission->values->count() }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Submission Values -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Submitted Data</h3>
        </div>
        <div class="card-body">
            @if($submission->values->count() > 0)
                <div class="space-y-6">
                    @foreach($submission->values as $value)
                        <div class="border-b border-black/20 pb-4 last:border-b-0">
                            <h4 class="font-medium text-black mb-2">{{ $value->field->label }}</h4>
                            @if($value->field->field_type === 'file' && $value->value)
                                <div class="flex items-center space-x-2">
                                    <svg class="w-5 h-5 text-black/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <span class="text-black">{{ basename($value->value) }}</span>
                                </div>
                            @elseif($value->field->field_type === 'textarea')
                                <div class="text-black whitespace-pre-wrap bg-gray-50 p-3 rounded border border-black/20">
                                    {{ $value->display_value ?: 'No response' }}
                                </div>
                            @else
                                <p class="text-black">{{ $value->display_value ?: 'No response' }}</p>
                            @endif
                        </div>
                    @endforeach
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No submission data</h3>
                    <p class="text-black/70">This submission doesn't contain any field data.</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Member Conversion Preview -->
    @if($submission->canConvertToMember())
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">Member Conversion Preview</h3>
            </div>
            <div class="card-body">
                <p class="text-black/70 mb-4">This submission contains the required information to create a member record:</p>
                
                @php
                    $memberData = $submission->toMemberData();
                @endphp
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm font-medium text-black">Full Name</p>
                            <p class="text-black">{{ $memberData['full_name'] }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-black">Phone Number</p>
                            <p class="text-black">{{ $memberData['phone_number'] }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-black">Role</p>
                            <p class="text-black">{{ $memberData['role'] }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-black">Area/District</p>
                            <p class="text-black">{{ $memberData['area_or_district'] ?: 'Not specified' }}</p>
                        </div>
                        @if(!empty($memberData['notes']))
                            <div class="md:col-span-2">
                                <p class="text-sm font-medium text-black">Additional Notes</p>
                                <p class="text-black">{{ $memberData['notes'] }}</p>
                            </div>
                        @endif
                    </div>
                </div>
                
                <div class="mt-4">
                    <form method="POST" action="{{ route('forms.submissions.convert-to-member', [$form, $submission]) }}" class="inline" onsubmit="return confirm('Are you sure you want to convert this submission to a member?');">
                        @csrf
                        <button type="submit" class="btn btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                            Convert to Member
                        </button>
                    </form>
                </div>
            </div>
        </div>
    @else
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">Member Conversion</h3>
            </div>
            <div class="card-body">
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p class="text-yellow-800">
                        <strong>This submission cannot be converted to a member.</strong><br>
                        Required fields are missing: Full Name and Phone Number.
                    </p>
                </div>
            </div>
        </div>
    @endif
</div>
@endsection