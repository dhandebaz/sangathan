@extends('layouts.app')

@section('title', 'Payment Claim Details')
@section('page-title', 'Payment Claim Details')
@section('page-subtitle', 'Claim #' . $claim->id)

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Payment Claim Details</h1>
            <p class="text-black/70">Claim #{{ $claim->id }}</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <a href="{{ route('payments.claims.index') }}" class="btn btn-secondary">
                Back to Claims
            </a>
            
            @if($claim->status === 'pending' && auth()->user()->can('update', $claim))
                <form method="POST" action="{{ route('payments.claims.verify', $claim) }}" class="inline" onsubmit="return confirm('Verify this payment claim? This will create a donation record.');">
                    @csrf
                    <button type="submit" class="btn btn-primary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Verify
                    </button>
                </form>
                
                <form method="POST" action="{{ route('payments.claims.reject', $claim) }}" class="inline" onsubmit="return confirm('Reject this payment claim?');">
                    @csrf
                    <button type="submit" class="btn btn-danger">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Reject
                    </button>
                </form>
            @endif
        </div>
    </div>

    <!-- Claim Status -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Claim Status</h3>
        </div>
        <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <p class="text-sm font-medium text-black">Status</p>
                    <p class="text-black">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {{ $claim->status_badge_class }}">
                            {{ $claim->status_display }}
                        </span>
                    </p>
                </div>
                
                <div>
                    <p class="text-sm font-medium text-black">Amount</p>
                    <p class="text-black font-semibold">₹{{ number_format($claim->amount, 2) }}</p>
                </div>
                
                <div>
                    <p class="text-sm font-medium text-black">Payment Method</p>
                    <p class="text-black">{{ $claim->payment_mode_display }}</p>
                </div>
            </div>
            
            @if($claim->status !== 'pending')
                <div class="mt-6 pt-6 border-t border-black/20">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm font-medium text-black">Verified By</p>
                            <p class="text-black">{{ $claim->verifier->name ?? 'N/A' }}</p>
                        </div>
                        
                        <div>
                            <p class="text-sm font-medium text-black">Verified At</p>
                            <p class="text-black">{{ $claim->verified_at ? $claim->verified_at->format('d M Y, h:i A') : 'N/A' }}</p>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>

    <!-- Claim Details -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Claim Details</h3>
        </div>
        <div class="card-body space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p class="text-sm font-medium text-black">Payer Name</p>
                    <p class="text-black">{{ $claim->payer_name }}</p>
                </div>
                
                <div>
                    <p class="text-sm font-medium text-black">Organisation</p>
                    <p class="text-black">{{ $claim->organisation->name }}</p>
                </div>
                
                <div>
                    <p class="text-sm font-medium text-black">Payment Method</p>
                    <p class="text-black">{{ $claim->payment_mode_display }}</p>
                </div>
                
                @if($claim->upi_reference_id)
                    <div>
                        <p class="text-sm font-medium text-black">UPI Reference ID</p>
                        <p class="text-black font-mono">{{ $claim->upi_reference_id }}</p>
                    </div>
                @endif
                
                <div>
                    <p class="text-sm font-medium text-black">Submitted</p>
                    <p class="text-black">{{ $claim->created_at->format('d M Y, h:i A') }}</p>
                </div>
                
                <div>
                    <p class="text-sm font-medium text-black">IP Address</p>
                    <p class="text-black font-mono text-sm">{{ $claim->submitter_ip ?? 'N/A' }}</p>
                </div>
            </div>
            
            @if($claim->notes)
                <div>
                    <p class="text-sm font-medium text-black">Notes</p>
                    <p class="text-black whitespace-pre-wrap">{{ $claim->notes }}</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Payment Proof -->
    @if($claim->screenshot)
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">Payment Proof Screenshot</h3>
            </div>
            <div class="card-body">
                <div class="flex justify-center">
                    <img src="{{ Storage::url($claim->screenshot) }}" alt="Payment Proof" class="max-w-full h-auto max-h-96 border border-black/20 rounded">
                </div>
            </div>
        </div>
    @endif

    <!-- Donation Record (if converted) -->
    @if($claim->status === 'verified' && $claim->donation)
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">Donation Record</h3>
            </div>
            <div class="card-body">
                <p class="text-black">This payment claim has been converted to a donation record.</p>
                <div class="mt-4">
                    <a href="{{ route('donations.show', $claim->donation) }}" class="btn btn-primary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Donation Record
                    </a>
                </div>
            </div>
        </div>
    @endif
</div>
@endsection