@extends('layouts.app')

@section('title', 'Submit Payment Claim')
@section('page-title', 'Submit Payment Claim')
@section('page-subtitle', 'Report your payment to {{ $organisation->name }}')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Submit Payment Claim</h1>
            <p class="text-black/70">Report your payment to {{ $organisation->name }}</p>
        </div>
        
        <a href="{{ route('payments.instructions') }}" class="btn btn-secondary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Payment Instructions
        </a>
    </div>

    <!-- Important Disclaimer -->
    <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div class="flex items-start space-x-3">
            <svg class="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <div>
                <h3 class="font-medium text-orange-800">Important Payment Disclaimer</h3>
                <p class="text-sm text-orange-700 mt-1">
                    <strong>Sangathan does not process payments.</strong> All payments are made directly to the organisation. 
                    This system only helps you report payments you've already made for verification.
                </p>
            </div>
        </div>
    </div>

    <!-- Payment Claim Form -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Payment Details</h3>
        </div>
        
        <form method="POST" action="{{ route('payments.claims.store') }}" enctype="multipart/form-data" class="card-body space-y-6">
            @csrf
            
            @if ($errors->any())
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <ul class="list-disc list-inside">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Payer Name -->
            <div>
                <label for="payer_name" class="block text-sm font-medium text-black mb-2">
                    Your Name *
                </label>
                <input 
                    type="text" 
                    name="payer_name" 
                    id="payer_name" 
                    value="{{ old('payer_name') }}"
                    required 
                    autofocus
                    class="form-input w-full @error('payer_name') border-red-500 @enderror"
                    placeholder="Enter your full name"
                >
                @error('payer_name')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Amount -->
            <div>
                <label for="amount" class="block text-sm font-medium text-black mb-2">
                    Payment Amount (₹) *
                </label>
                <input 
                    type="number" 
                    name="amount" 
                    id="amount" 
                    value="{{ old('amount') }}"
                    required 
                    min="1" 
                    max="1000000"
                    step="0.01"
                    class="form-input w-full @error('amount') border-red-500 @enderror"
                    placeholder="Enter payment amount"
                >
                @error('amount')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Payment Mode -->
            <div>
                <label for="payment_mode" class="block text-sm font-medium text-black mb-2">
                    Payment Method *
                </label>
                <select 
                    name="payment_mode" 
                    id="payment_mode" 
                    required 
                    class="form-input w-full @error('payment_mode') border-red-500 @enderror"
                    onchange="updatePaymentModeFields()"
                >
                    <option value="">Select payment method</option>
                    @foreach($profile->getAvailablePaymentMethods() as $value => $label)
                        <option value="{{ $value }}" {{ old('payment_mode') == $value ? 'selected' : '' }}>
                            {{ $label }}
                        </option>
                    @endforeach
                    <option value="cash" {{ old('payment_mode') == 'cash' ? 'selected' : '' }}>Cash</option>
                </select>
                @error('payment_mode')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- UPI Reference ID (conditional) -->
            <div id="upi_reference_field" class="hidden">
                <label for="upi_reference_id" class="block text-sm font-medium text-black mb-2">
                    UPI Reference ID (Optional)
                </label>
                <input 
                    type="text" 
                    name="upi_reference_id" 
                    id="upi_reference_id" 
                    value="{{ old('upi_reference_id') }}"
                    maxlength="100"
                    class="form-input w-full @error('upi_reference_id') border-red-500 @enderror"
                    placeholder="Enter UPI transaction reference ID"
                >
                <p class="text-xs text-black/70 mt-1">You can find this in your UPI app transaction details</p>
                @error('upi_reference_id')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Screenshot Upload -->
            <div>
                <label for="screenshot" class="block text-sm font-medium text-black mb-2">
                    Payment Proof Screenshot *
                </label>
                <input 
                    type="file" 
                    name="screenshot" 
                    id="screenshot" 
                    accept="image/*"
                    required
                    class="form-input w-full @error('screenshot') border-red-500 @enderror"
                >
                <p class="text-xs text-black/70 mt-1">
                    Upload screenshot of payment confirmation, transaction receipt, or payment proof (Max 2MB)
                </p>
                @error('screenshot')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Notes -->
            <div>
                <label for="notes" class="block text-sm font-medium text-black mb-2">
                    Additional Notes (Optional)
                </label>
                <textarea 
                    name="notes" 
                    id="notes" 
                    rows="3"
                    class="form-input w-full @error('notes') border-red-500 @enderror"
                    placeholder="Any additional information about your payment"
                >{{ old('notes') }}</textarea>
                @error('notes')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-4">
                <a href="{{ route('payments.instructions') }}" class="btn btn-secondary">
                    Cancel
                </a>
                <button type="submit" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Submit Payment Claim
                </button>
            </div>
        </form>
    </div>
</div>

@push('scripts')
<script>
function updatePaymentModeFields() {
    const paymentMode = document.getElementById('payment_mode').value;
    const upiReferenceField = document.getElementById('upi_reference_field');
    
    if (paymentMode === 'upi') {
        upiReferenceField.classList.remove('hidden');
        document.getElementById('upi_reference_id').required = false;
    } else {
        upiReferenceField.classList.add('hidden');
        document.getElementById('upi_reference_id').required = false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updatePaymentModeFields();
});
</script>
@endpush
@endsection