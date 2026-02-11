@extends('layouts.app')

@section('title', 'Payment - ' . $organisation->name)

@section('content')
<div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Payment Disclaimer -->
    <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Important Payment Notice</h3>
                <div class="mt-2 text-sm text-red-700">
                    <p><strong>Sangathan does NOT process payments.</strong> All payments are made directly to the organisation through their verified payment methods. Sangathan only facilitates the payment process and records payment claims for verification.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Organisation Header -->
    <div class="bg-white rounded-lg shadow-sm border border-black mb-8">
        <div class="p-6">
            <div class="flex items-center mb-4">
                @if($organisation->logo)
                    <img src="{{ Storage::url($organisation->logo) }}" alt="{{ $organisation->name }}" class="h-12 w-12 rounded-lg object-cover mr-4">
                @endif
                <div>
                    <h1 class="text-2xl font-bold text-black">{{ $organisation->name }}</h1>
                    <p class="text-gray-600">Make a payment to this organisation</p>
                </div>
            </div>

            @if($organisation->description)
                <p class="text-gray-700 mb-4">{{ $organisation->description }}</p>
            @endif
        </div>
    </div>

    <!-- Payment Methods -->
    <div class="bg-white rounded-lg shadow-sm border border-black mb-8">
        <div class="p-6">
            <h2 class="text-xl font-bold text-black mb-6">Available Payment Methods</h2>

            @if($paymentProfile->upi_id)
                <div class="border border-black rounded-lg p-6 mb-6">
                    <div class="flex items-center mb-4">
                        <svg class="h-8 w-8 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        <div>
                            <h3 class="text-lg font-semibold text-black">UPI Payment</h3>
                            <p class="text-sm text-gray-600">Pay using any UPI app</p>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-black mb-2">UPI ID</label>
                            <div class="flex items-center">
                                <input type="text" value="{{ $paymentProfile->upi_id }}" readonly class="flex-1 px-3 py-2 border border-black bg-gray-50 rounded-md text-black font-mono text-sm">
                                <button onclick="copyUpiId()" class="ml-2 px-3 py-2 border border-black bg-orange-500 text-black rounded-md hover:bg-orange-600 transition-colors">
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-black mb-2">Payment Amount (₹)</label>
                            <input type="number" id="paymentAmount" placeholder="Enter amount" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        </div>

                        <button onclick="generateUpiLink()" class="w-full px-4 py-2 bg-orange-500 text-black font-semibold rounded-md hover:bg-orange-600 transition-colors border border-black">
                            Generate UPI Payment Link
                        </button>

                        <div id="upiLinkContainer" class="hidden">
                            <label class="block text-sm font-medium text-black mb-2">UPI Payment Link</label>
                            <div class="flex items-center">
                                <input type="text" id="upiLink" readonly class="flex-1 px-3 py-2 border border-black bg-gray-50 rounded-md text-black font-mono text-sm">
                                <button onclick="copyUpiLink()" class="ml-2 px-3 py-2 border border-black bg-orange-500 text-black rounded-md hover:bg-orange-600 transition-colors">
                                    Copy
                                </button>
                            </div>
                            <a id="upiIntentLink" href="#" class="mt-2 inline-block px-4 py-2 bg-green-500 text-black font-semibold rounded-md hover:bg-green-600 transition-colors border border-black">
                                Open in UPI App
                            </a>
                        </div>
                    </div>
                </div>
            @endif

            @if($paymentProfile->bank_account_number && $paymentProfile->bank_ifsc)
                <div class="border border-black rounded-lg p-6 mb-6">
                    <div class="flex items-center mb-4">
                        <svg class="h-8 w-8 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 10h16v8H4z"/>
                            <path d="M20 6H4V4h16v2zm-2 2v8h2V8h-2z"/>
                            <path d="M2 20h20v2H2z"/>
                        </svg>
                        <div>
                            <h3 class="text-lg font-semibold text-black">Bank Transfer</h3>
                            <p class="text-sm text-gray-600">Direct bank transfer (NEFT/RTGS/IMPS)</p>
                        </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-black mb-2">Account Number</label>
                            <div class="flex items-center">
                                <input type="text" value="{{ $paymentProfile->bank_account_number }}" readonly class="flex-1 px-3 py-2 border border-black bg-gray-50 rounded-md text-black font-mono text-sm">
                                <button onclick="copyBankAccount()" class="ml-2 px-3 py-2 border border-black bg-orange-500 text-black rounded-md hover:bg-orange-600 transition-colors">
                                    Copy
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-black mb-2">IFSC Code</label>
                            <div class="flex items-center">
                                <input type="text" value="{{ $paymentProfile->bank_ifsc }}" readonly class="flex-1 px-3 py-2 border border-black bg-gray-50 rounded-md text-black font-mono text-sm">
                                <button onclick="copyBankIfsc()" class="ml-2 px-3 py-2 border border-black bg-orange-500 text-black rounded-md hover:bg-orange-600 transition-colors">
                                    Copy
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-black mb-2">Account Holder</label>
                            <input type="text" value="{{ $paymentProfile->bank_account_holder ?? $organisation->name }}" readonly class="w-full px-3 py-2 border border-black bg-gray-50 rounded-md text-black text-sm">
                        </div>
                    </div>
                </div>
            @endif

            @if($paymentProfile->other_payment_methods)
                <div class="border border-black rounded-lg p-6">
                    <div class="flex items-center mb-4">
                        <svg class="h-8 w-8 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                        </svg>
                        <div>
                            <h3 class="text-lg font-semibold text-black">Other Payment Methods</h3>
                            <p class="text-sm text-gray-600">Additional payment options</p>
                        </div>
                    </div>

                    <div class="prose text-black">
                        {!! nl2br(e($paymentProfile->other_payment_methods)) !!}
                    </div>
                </div>
            @endif
        </div>
    </div>

    <!-- Payment Claim Submission -->
    <div class="bg-white rounded-lg shadow-sm border border-black mb-8">
        <div class="p-6">
            <h2 class="text-xl font-bold text-black mb-6">Submit Payment Claim</h2>
            <p class="text-gray-700 mb-6">After making your payment, please submit a claim with payment proof for verification.</p>

            <form action="{{ route('payments.claims.store', $organisation) }}" method="POST" enctype="multipart/form-data" class="space-y-6">
                @csrf
                
                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label for="payer_name" class="block text-sm font-medium text-black mb-2">Your Name *</label>
                        <input type="text" name="payer_name" id="payer_name" required class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    
                    <div>
                        <label for="payer_email" class="block text-sm font-medium text-black mb-2">Your Email *</label>
                        <input type="email" name="payer_email" id="payer_email" required class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    
                    <div>
                        <label for="payer_phone" class="block text-sm font-medium text-black mb-2">Your Phone *</label>
                        <input type="tel" name="payer_phone" id="payer_phone" required class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                    
                    <div>
                        <label for="amount" class="block text-sm font-medium text-black mb-2">Payment Amount (₹) *</label>
                        <input type="number" name="amount" id="amount" step="0.01" required class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    </div>
                </div>

                <div>
                    <label for="payment_method" class="block text-sm font-medium text-black mb-2">Payment Method *</label>
                    <select name="payment_method" id="payment_method" required class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <option value="">Select payment method</option>
                        @if($paymentProfile->upi_id)
                            <option value="upi">UPI</option>
                        @endif
                        @if($paymentProfile->bank_account_number)
                            <option value="bank_transfer">Bank Transfer</option>
                        @endif
                        @if($paymentProfile->other_payment_methods)
                            <option value="other">Other</option>
                        @endif
                    </select>
                </div>

                <div>
                    <label for="transaction_reference" class="block text-sm font-medium text-black mb-2">Transaction Reference *</label>
                    <input type="text" name="transaction_reference" id="transaction_reference" required class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="UPI transaction ID, bank reference number, etc.">
                    <p class="text-sm text-gray-600 mt-1">Enter the transaction reference number from your payment confirmation</p>
                </div>

                <div>
                    <label for="payment_proof" class="block text-sm font-medium text-black mb-2">Payment Proof Screenshot *</label>
                    <input type="file" name="payment_proof" id="payment_proof" accept="image/*" required class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <p class="text-sm text-gray-600 mt-1">Upload screenshot of payment confirmation (max 2MB)</p>
                </div>

                <div>
                    <label for="notes" class="block text-sm font-medium text-black mb-2">Additional Notes</label>
                    <textarea name="notes" id="notes" rows="3" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Any additional information about your payment"></textarea>
                </div>

                <div class="flex items-center">
                    <input type="checkbox" name="disclaimer_accepted" id="disclaimer_accepted" required class="h-4 w-4 text-orange-500 focus:ring-orange-500 border border-black rounded">
                    <label for="disclaimer_accepted" class="ml-2 block text-sm text-black">
                        I understand that Sangathan does not process payments and only facilitates payment verification. All payments are made directly to the organisation.
                    </label>
                </div>

                <button type="submit" class="w-full px-4 py-2 bg-orange-500 text-black font-semibold rounded-md hover:bg-orange-600 transition-colors border border-black">
                    Submit Payment Claim
                </button>
            </form>
        </div>
    </div>

    <!-- Contact Information -->
    @if($organisation->email || $organisation->phone)
    <div class="bg-white rounded-lg shadow-sm border border-black">
        <div class="p-6">
            <h2 class="text-xl font-bold text-black mb-4">Need Help?</h2>
            <p class="text-gray-700 mb-4">Contact the organisation if you have any payment-related questions:</p>
            
            <div class="space-y-2">
                @if($organisation->email)
                    <div class="flex items-center">
                        <svg class="h-5 w-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                        </svg>
                        <a href="mailto:{{ $organisation->email }}" class="text-black hover:underline">{{ $organisation->email }}</a>
                    </div>
                @endif
                
                @if($organisation->phone)
                    <div class="flex items-center">
                        <svg class="h-5 w-5 text-black mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                        </svg>
                        <a href="tel:{{ $organisation->phone }}" class="text-black hover:underline">{{ $organisation->phone }}</a>
                    </div>
                @endif
            </div>
        </div>
    </div>
    @endif
</div>

<script>
function copyUpiId() {
    const upiId = '{{ $paymentProfile->upi_id }}';
    navigator.clipboard.writeText(upiId).then(() => {
        alert('UPI ID copied to clipboard!');
    });
}

function copyBankAccount() {
    const accountNumber = '{{ $paymentProfile->bank_account_number }}';
    navigator.clipboard.writeText(accountNumber).then(() => {
        alert('Bank account number copied to clipboard!');
    });
}

function copyBankIfsc() {
    const ifsc = '{{ $paymentProfile->bank_ifsc }}';
    navigator.clipboard.writeText(ifsc).then(() => {
        alert('IFSC code copied to clipboard!');
    });
}

function copyUpiLink() {
    const upiLink = document.getElementById('upiLink').value;
    if (upiLink) {
        navigator.clipboard.writeText(upiLink).then(() => {
            alert('UPI payment link copied to clipboard!');
        });
    }
}

function generateUpiLink() {
    const amount = document.getElementById('paymentAmount').value;
    if (!amount || amount <= 0) {
        alert('Please enter a valid payment amount');
        return;
    }

    const upiId = '{{ $paymentProfile->upi_id }}';
    const organisationName = '{{ urlencode($organisation->name) }}';
    const encodedAmount = encodeURIComponent(amount);
    
    const upiLink = `upi://pay?pa=${upiId}&pn=${organisationName}&am=${encodedAmount}&tn=Payment%20via%20Sangathan`;
    
    document.getElementById('upiLink').value = upiLink;
    document.getElementById('upiIntentLink').href = upiLink;
    document.getElementById('upiLinkContainer').classList.remove('hidden');
}

// Auto-fill amount in claim form when amount is entered in UPI section
document.getElementById('paymentAmount').addEventListener('input', function() {
    document.getElementById('amount').value = this.value;
});
</script>
@endsection