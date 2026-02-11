@extends('layouts.app')

@section('title', 'Submissions - ' . $form->title)
@section('page-title', 'Form Submissions')
@section('page-subtitle', $form->title)

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Form Submissions</h1>
            <p class="text-black/70">{{ $form->title }}</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <a href="{{ route('export.form.submissions.pdf', $form) }}" class="btn btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export PDF
            </a>
            
            <a href="{{ route('forms.index') }}" class="btn btn-secondary">
                Back to Forms
            </a>
            <a href="{{ route('forms.submissions.index', $form) }}" class="btn btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
            </a>
        </div>
    </div>

    <!-- Filter Section -->
    <div class="card">
        <div class="card-body">
            <form method="GET" action="{{ route('forms.submissions.index', $form) }}" class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                    <label for="start_date" class="block text-sm font-medium text-black mb-2">Start Date</label>
                    <input type="date" name="start_date" id="start_date" value="{{ request('start_date') }}" class="form-input w-full">
                </div>
                <div class="flex-1">
                    <label for="end_date" class="block text-sm font-medium text-black mb-2">End Date</label>
                    <input type="date" name="end_date" id="end_date" value="{{ request('end_date') }}" class="form-input w-full">
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

    <!-- Submissions Table -->
    <div class="card">
        <div class="card-body">
            @if($submissions->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Submitted</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">IP Address</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Fields</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($submissions as $submission)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div>{{ $submission->submitted_at->format('d M Y') }}</div>
                                        <div class="text-sm text-black/70">{{ $submission->submitted_at->format('h:i A') }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <code class="text-sm">{{ $submission->submitter_ip ?? 'N/A' }}</code>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $submission->values->count() }} fields
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <a href="{{ route('forms.submissions.show', [$form, $submission]) }}" class="text-blue-600 hover:text-blue-700 p-1" title="View Details">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                            </a>
                                            
                                            @if($submission->canConvertToMember())
                                                <form method="POST" action="{{ route('forms.submissions.convert-to-member', [$form, $submission]) }}" class="inline" onsubmit="return confirm('Convert this submission to a member? This will create a new member record.');">
                                                    @csrf
                                                    <button type="submit" class="text-green-600 hover:text-green-700 p-1" title="Convert to Member">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
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
                    {{ $submissions->appends(request()->query())->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No submissions yet</h3>
                    <p class="text-black/70 mb-4">This form hasn't received any submissions yet.</p>
                    @if($form->is_public)
                        <p class="text-sm text-black/60 mb-4">Share this public link:</p>
                        <div class="flex items-center justify-center space-x-2">
                            <input type="text" value="{{ $form->public_url }}" class="form-input text-sm max-w-xs" readonly>
                            <button onclick="copyPublicUrl()" class="btn btn-secondary text-sm">
                                Copy
                            </button>
                        </div>
                    @endif
                </div>
            @endif
        </div>
    </div>
</div>

@push('scripts')
<script>
function copyPublicUrl() {
    const urlInput = document.querySelector('input[value="{{ $form->public_url }}"]');
    if (urlInput) {
        urlInput.select();
        document.execCommand('copy');
        alert('Public URL copied to clipboard!');
    }
}
</script>
@endpush
@endsection