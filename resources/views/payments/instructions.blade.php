@extends('layouts.app')

@section('title', 'Payment Instructions')
@section('page-title', 'Payment Instructions')
@section('page-subtitle', 'How supporters can make payments to your organisation')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Payment Instructions</h1>
            <p class="text-black/70">How supporters can make payments to your organisation</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <a href="{{ route('payments.profile.index') }}" class="btn btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Payment Settings
            </a>
            <a href="{{ route('payments.claims.create') }}" class="btn btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Submit Payment Claim
            </a>
        </div>
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

    @if($profile && ($profile->hasUpiDetails() || $profile->hasBankDetails()))
        <!-- Payment Methods -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            @if($profile->hasUpiDetails())
                <!-- UPI Section -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-medium text-black flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            UPI Payment
                        </h3>
                    </div>
                    <div class="card-body space-y-4">
                        <div>
                            <p class="text-sm font-medium text-black mb-1">UPI ID</p>
                            <p class="text-black font-mono">{{ $profile->upi_id }}</p>
                        </div>
                        
                        @if($profile->upi_qr_image)
                            <div>
                                <p class="text-sm font-medium text-black mb-2">Scan QR Code</p>
                                <img src="{{ Storage::url($profile->upi_qr_image) }}" alt="UPI QR Code" class="w-48 h-48 object-contain border border-black/20 rounded mx-auto">
                            </div>
                        @endif
                        
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p class="text-sm text-blue-800">
                                <strong>How to pay via UPI:</strong><br>
                                1. Open your UPI app (Google Pay, PhonePe, Paytm, etc.)<br>
                                2. Scan the QR code or enter UPI ID manually<br>
                                3. Enter amount and complete payment<br>
                                4. Take screenshot of payment confirmation<br>
                                5. Submit payment claim with screenshot
                            </p>
                        </div>
                    </div>
                </div>
            @endif

            @if($profile->hasBankDetails())
                <!-- Bank Transfer Section -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="text-lg font-medium text-black flex items-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            Bank Transfer
                        </h3>
                    </div>
                    <div class="card-body space-y-4">
                        @php
                            $bankDetails = $profile->getFormattedBankDetails();
                        @endphp
                        
                        <div>
                            <p class="text-sm font-medium text-black mb-1">Account Holder Name</p>
                            <p class="text-black">{{ $bankDetails['account_holder_name'] }}</p>
                        </div>
                        
                        <div>
                            <p class="text-sm font-medium text-black mb-1">Bank Name</p>
                            <p class="text-black">{{ $bankDetails['bank_name'] }}</p>
                        </div>
                        
                        <div>
                            <p class="text-sm font-medium text-black mb-1">Account Number</p>
                            <p class="text-black font-mono">{{ $bankDetails['account_number'] }}</p>
                        </div>
                        
                        <div>
                            <p class="text-sm font-medium text-black mb-1">IFSC Code</p>
                            <p class="text-black font-mono">{{ $bankDetails['ifsc_code'] }}</p>
                        </div>
                        
                        @if($bankDetails['branch'])
                            <div>
                                <p class="text-sm font-medium text-black mb-1">Branch</p>
                                <p class="text-black">{{ $bankDetails['branch'] }}</p>
                            </div>
                        @endif
                        
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p class="text-sm text-blue-800">
                                <strong>How to pay via Bank Transfer:</strong><br>
                                1. Use net banking or mobile banking app<br>
                                2. Add beneficiary using above details<br>
                                3. Transfer amount to the account<br>
                                4. Take screenshot of transaction confirmation<br>
                                5. Submit payment claim with screenshot
                            </p>
                        </div>
                    </div>
                </div>
            @endif
        </div>

        <!-- Cash Payment Section -->
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Cash Payment
                </h3>
            </div>
            <div class="card-body">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p class="text-sm text-blue-800">
                        <strong>How to pay via Cash:</strong><br>
                        1. Visit the organisation office or designated location<br>
                        2. Make cash payment and collect receipt<br>
                        3. Take photo of the receipt<br>
                        4. Submit payment claim with receipt photo
                    </p>
                </div>
            </div>
        </div>

        <!-- Next Steps -->
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">Next Steps</h3>
            </div>
            <div class="card-body">
                <div class="space-y-4">
                    <div class="flex items-start space-x-3">
                        <div class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span class="text-orange-600 text-sm font-medium">1</span>
                        </div>
                        <div>
                            <h4 class="font-medium text-black">Make Payment</h4>
                            <p class="text-black/70 text-sm">Use any of the above payment methods to make your payment</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-3">
                        <div class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span class="text-orange-600 text-sm font-medium">2</span>
                        </div>
                        <div>
                            <h4 class="font-medium text-black">Save Proof</h4>
                            <p class="text-black/70 text-sm">Take screenshot or photo of payment confirmation/receipt</p>
                        </div>
                    </div>
                    
                    <div class="flex items-start space-x-3">
                        <div class="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span class="text-orange-600 text-sm font-medium">3</span>
                        </div>
                        <div>
                            <h4 class="font-medium text-black">Submit Claim</h4>
                            <p class="text-black/70 text-sm">Submit payment claim with proof for verification</p>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 pt-4 border-t border-black/20">
                    <a href="{{ route('payments.claims.create') }}" class="btn btn-primary w-full">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Submit Payment Claim
                    </a>
                </div>
            </div>
        </div>
    @else
        <!-- No Payment Methods Configured -->
        <div class="card">
            <div class="card-body text-center py-12">
                <svg class="w-16 h-16 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <h3 class="text-lg font-medium text-black mb-2">Payment Methods Not Configured</h3>
                <p class="text-black/70 mb-6">No payment methods have been set up for this organisation yet.</p>
                
                @can('update', $organisation)
                    <a href="{{ route('payments.profile.index') }}" class="btn btn-primary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Configure Payment Settings
                    </a>
                @endcan
            </div>
        </div>
    @endif
</div>
@endsection