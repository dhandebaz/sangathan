@extends('layouts.app')

@section('title', 'Payment Claims')
@section('page-title', 'Payment Claims')
@section('page-subtitle', 'Manage and verify payment claims')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Payment Claims</h1>
            <p class="text-black/70">Manage and verify payment claims from supporters</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <a href="{{ route('payments.instructions') }}" class="btn btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Payment Instructions
            </a>
            <a href="{{ route('payments.claims.create') }}" class="btn btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Submit Claim
            </a>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
            <div class="card-body">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-black">Pending Claims</p>
                        <p class="text-2xl font-semibold text-black">{{ $claims->where('status', 'pending')->count() }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-black">Verified Claims</p>
                        <p class="text-2xl font-semibold text-black">{{ $claims->where('status', 'verified')->count() }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-black">Rejected Claims</p>
                        <p class="text-2xl font-semibold text-black">{{ $claims->where('status', 'rejected')->count() }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Claims Table -->
    <div class="card">
        <div class="card-body">
            @if($claims->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Payer</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Amount</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Method</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Status</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Submitted</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($claims as $claim)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $claim->payer_name }}</div>
                                        <div class="text-sm text-black/70">{{ $claim->upi_reference_id ?: 'No reference' }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        ₹{{ number_format($claim->amount, 2) }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $claim->payment_mode_display }}
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $claim->status_badge_class }}">
                                            {{ $claim->status_display }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <div>{{ $claim->created_at->format('d M Y') }}</div>
                                        <div class="text-sm text-black/70">{{ $claim->created_at->format('h:i A') }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <a href="{{ route('payments.claims.show', $claim) }}" class="text-blue-600 hover:text-blue-700 p-1" title="View Details">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                            </a>
                                            
                                            @if($claim->status === 'pending')
                                                @can('update', $claim)
                                                    <form method="POST" action="{{ route('payments.claims.verify', $claim) }}" class="inline" onsubmit="return confirm('Verify this payment claim? This will create a donation record.');">
                                                        @csrf
                                                        <button type="submit" class="text-green-600 hover:text-green-700 p-1" title="Verify">
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </button>
                                                    </form>
                                                    
                                                    <form method="POST" action="{{ route('payments.claims.reject', $claim) }}" class="inline" onsubmit="return confirm('Reject this payment claim?');">
                                                        @csrf
                                                        <button type="submit" class="text-red-600 hover:text-red-700 p-1" title="Reject">
                                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                            </svg>
                                                        </button>
                                                    </form>
                                                @endcan
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
                    {{ $claims->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No payment claims yet</h3>
                    <p class="text-black/70 mb-4">No payment claims have been submitted yet.</p>
                    <a href="{{ route('payments.claims.create') }}" class="btn btn-primary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Submit First Claim
                    </a>
                </div>
            @endif
        </div>
    </div>
</div>
@endsection