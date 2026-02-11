@extends('layouts.app')

@section('title', 'Payment Settings - ' . $organisation->name)

@section('content')
<div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-black">Payment Settings</h1>
        <a href="{{ route('organisations.dashboard', $organisation) }}" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors border border-black">
            Back to Dashboard
        </a>
    </div>

    <!-- Payment Disclaimer -->
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div class="flex">
            <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Payment Processing Notice</h3>
                <div class="mt-2 text-sm text-yellow-700">
                    <p><strong>Sangathan does NOT handle payments.</strong> These settings only configure how people can pay your organisation directly. All payments go directly to your accounts, and Sangathan only facilitates payment claims for verification.</p>
                </div>
            </div>
        </div>
    </div>

    <form action="{{ route('payments.profile.update', $organisation) }}" method="POST" class="space-y-8">
        @csrf
        @method('PUT')

        <!-- UPI Settings -->
        <div class="bg-white rounded-lg shadow-sm border border-black">
            <div class="p-6">
                <div class="flex items-center mb-6">
                    <svg class="h-8 w-8 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <h2 class="text-xl font-bold text-black">UPI Settings</h2>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label for="upi_id" class="block text-sm font-medium text-black mb-2">UPI ID</label>
                        <input type="text" name="upi_id" id="upi_id" value="{{ old('upi_id', $profile->upi_id) }}" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="example@upi">
                        <p class="text-sm text-gray-600 mt-1">Format: username@bank or mobilenumber@upi</p>
                    </div>

                    <div>
                        <label for="upi_qr_code" class="block text-sm font-medium text-black mb-2">UPI QR Code</label>
                        <input type="file" name="upi_qr_code" id="upi_qr_code" accept="image/*" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <p class="text-sm text-gray-600 mt-1">Upload QR code image (optional, max 2MB)</p>
                        @if($profile->upi_qr_code)
                            <div class="mt-2">
                                <img src="{{ Storage::url($profile->upi_qr_code) }}" alt="UPI QR Code" class="h-32 w-32 object-contain border border-black rounded">
                                <label class="inline-flex items-center mt-2">
                                    <input type="checkbox" name="remove_upi_qr_code" value="1" class="h-4 w-4 text-orange-500 focus:ring-orange-500 border border-black rounded">
                                    <span class="ml-2 text-sm text-black">Remove current QR code</span>
                                </label>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Bank Transfer Settings -->
        <div class="bg-white rounded-lg shadow-sm border border-black">
            <div class="p-6">
                <div class="flex items-center mb-6">
                    <svg class="h-8 w-8 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 10h16v8H4z"/>
                        <path d="M20 6H4V4h16v2zm-2 2v8h2V8h-2z"/>
                        <path d="M2 20h20v2H2z"/>
                    </svg>
                    <h2 class="text-xl font-bold text-black">Bank Transfer Settings</h2>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <div>
                        <label for="bank_account_number" class="block text-sm font-medium text-black mb-2">Account Number</label>
                        <input type="text" name="bank_account_number" id="bank_account_number" value="{{ old('bank_account_number', $profile->bank_account_number) }}" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="1234567890">
                    </div>

                    <div>
                        <label for="bank_ifsc" class="block text-sm font-medium text-black mb-2">IFSC Code</label>
                        <input type="text" name="bank_ifsc" id="bank_ifsc" value="{{ old('bank_ifsc', $profile->bank_ifsc) }}" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ABCD0123456">
                    </div>

                    <div>
                        <label for="bank_account_holder" class="block text-sm font-medium text-black mb-2">Account Holder Name</label>
                        <input type="text" name="bank_account_holder" id="bank_account_holder" value="{{ old('bank_account_holder', $profile->bank_account_holder) }}" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Account holder name">
                        <p class="text-sm text-gray-600 mt-1">Leave blank to use organisation name</p>
                    </div>

                    <div>
                        <label for="bank_name" class="block text-sm font-medium text-black mb-2">Bank Name</label>
                        <input type="text" name="bank_name" id="bank_name" value="{{ old('bank_name', $profile->bank_name) }}" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Bank name">
                    </div>
                </div>
            </div>
        </div>

        <!-- Other Payment Methods -->
        <div class="bg-white rounded-lg shadow-sm border border-black">
            <div class="p-6">
                <div class="flex items-center mb-6">
                    <svg class="h-8 w-8 text-black mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                    <h2 class="text-xl font-bold text-black">Other Payment Methods</h2>
                </div>

                <div>
                    <label for="other_payment_methods" class="block text-sm font-medium text-black mb-2">Additional Payment Information</label>
                    <textarea name="other_payment_methods" id="other_payment_methods" rows="4" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Any additional payment methods or instructions">{{ old('other_payment_methods', $profile->other_payment_methods) }}</textarea>
                    <p class="text-sm text-gray-600 mt-1">Include any other payment methods, wallet details, or special instructions</p>
                </div>
            </div>
        </div>

        <!-- Payment Instructions -->
        <div class="bg-white rounded-lg shadow-sm border border-black">
            <div class="p-6">
                <div class="flex items-center mb-6">
                    <svg class="h-8 w-8 text-black mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
                    </svg>
                    <h2 class="text-xl font-bold text-black">Payment Instructions</h2>
                </div>

                <div>
                    <label for="payment_instructions" class="block text-sm font-medium text-black mb-2">Instructions for Payers</label>
                    <textarea name="payment_instructions" id="payment_instructions" rows="4" class="w-full px-3 py-2 border border-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Instructions for people making payments">{{ old('payment_instructions', $profile->payment_instructions) }}</textarea>
                    <p class="text-sm text-gray-600 mt-1">Include any special instructions, minimum amounts, or processing times</p>
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div class="flex justify-end space-x-4">
            <a href="{{ route('organisations.dashboard', $organisation) }}" class="px-6 py-2 border border-black text-black rounded-md hover:bg-gray-50 transition-colors">
                Cancel
            </a>
            <button type="submit" class="px-6 py-2 bg-orange-500 text-black font-semibold rounded-md hover:bg-orange-600 transition-colors border border-black">
                Save Payment Settings
            </button>
        </div>
    </form>
</div>
@endsection