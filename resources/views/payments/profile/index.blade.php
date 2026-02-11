@extends('layouts.app')

@section('title', 'Payment Settings')
@section('page-title', 'Payment Settings')
@section('page-subtitle', 'Configure payment methods for your organisation')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Payment Settings</h1>
            <p class="text-black/70">Configure payment methods for your organisation</p>
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
                    <strong>Sangathan does not process payments.</strong> All payments are made directly to your organisation. 
                    This system only helps you collect and verify payment claims from supporters.
                </p>
            </div>
        </div>
    </div>

    <!-- Payment Profile Form -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Payment Methods</h3>
        </div>
        
        <form method="POST" action="{{ route('payments.profile.store') }}" enctype="multipart/form-data" class="card-body space-y-6">
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

            @if (session('success'))
                <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {{ session('success') }}
                </div>
            @endif

            <!-- UPI Section -->
            <div class="border border-black/20 rounded-lg p-4">
                <h4 class="font-medium text-black mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                    </svg>
                    UPI Payment Details
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="upi_id" class="block text-sm font-medium text-black mb-2">UPI ID</label>
                        <input 
                            type="text" 
                            name="upi_id" 
                            id="upi_id" 
                            value="{{ old('upi_id', $profile->upi_id ?? '') }}"
                            class="form-input w-full"
                            placeholder="username@bank"
                        >
                        <p class="text-xs text-black/70 mt-1">Format: username@bank (e.g., john@axis)</p>
                        @error('upi_id')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <label for="upi_qr_image" class="block text-sm font-medium text-black mb-2">UPI QR Code Image</label>
                        <input 
                            type="file" 
                            name="upi_qr_image" 
                            id="upi_qr_image" 
                            accept="image/*"
                            class="form-input w-full"
                        >
                        @if($profile && $profile->upi_qr_image)
                            <div class="mt-2">
                                <img src="{{ Storage::url($profile->upi_qr_image) }}" alt="UPI QR Code" class="w-32 h-32 object-contain border border-black/20 rounded">
                                <p class="text-xs text-black/60 mt-1">Current QR code image</p>
                            </div>
                        @endif
                        <p class="text-xs text-black/70 mt-1">Upload your UPI QR code image (optional)</p>
                        @error('upi_qr_image')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                </div>
            </div>

            <!-- Bank Transfer Section -->
            <div class="border border-black/20 rounded-lg p-4">
                <h4 class="font-medium text-black mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Bank Transfer Details
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="account_holder_name" class="block text-sm font-medium text-black mb-2">Account Holder Name</label>
                        <input 
                            type="text" 
                            name="account_holder_name" 
                            id="account_holder_name" 
                            value="{{ old('account_holder_name', $profile->account_holder_name ?? '') }}"
                            class="form-input w-full"
                            placeholder="Full name as per bank records"
                        >
                        @error('account_holder_name')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <label for="bank_name" class="block text-sm font-medium text-black mb-2">Bank Name</label>
                        <input 
                            type="text" 
                            name="bank_name" 
                            id="bank_name" 
                            value="{{ old('bank_name', $profile->bank_name ?? '') }}"
                            class="form-input w-full"
                            placeholder="Bank name"
                        >
                        @error('bank_name')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <label for="account_number" class="block text-sm font-medium text-black mb-2">Account Number</label>
                        <input 
                            type="text" 
                            name="account_number" 
                            id="account_number" 
                            value="{{ old('account_number', $profile->account_number ?? '') }}"
                            class="form-input w-full"
                            placeholder="Account number"
                        >
                        @error('account_number')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div>
                        <label for="ifsc_code" class="block text-sm font-medium text-black mb-2">IFSC Code</label>
                        <input 
                            type="text" 
                            name="ifsc_code" 
                            id="ifsc_code" 
                            value="{{ old('ifsc_code', $profile->ifsc_code ?? '') }}"
                            class="form-input w-full"
                            placeholder="IFSC code"
                        >
                        @error('ifsc_code')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                    
                    <div class="md:col-span-2">
                        <label for="branch" class="block text-sm font-medium text-black mb-2">Branch (Optional)</label>
                        <input 
                            type="text" 
                            name="branch" 
                            id="branch" 
                            value="{{ old('branch', $profile->branch ?? '') }}"
                            class="form-input w-full"
                            placeholder="Branch name"
                        >
                        @error('branch')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                </div>
            </div>

            <!-- Cash Section -->
            <div class="border border-black/20 rounded-lg p-4">
                <h4 class="font-medium text-black mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Cash Payment
                </h4>
                
                <p class="text-sm text-black/70">
                    Cash payments will be handled directly. Supporters can submit payment claims with details of their cash payment.
                </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-4">
                <a href="{{ route('dashboard') }}" class="btn btn-secondary">
                    Cancel
                </a>
                <button type="submit" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Save Payment Settings
                </button>
            </div>
        </form>
    </div>
</div>
@endsection