@extends('layouts.public')

@section('title', 'Register')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-orange-500">
    <div class="max-w-4xl w-full mx-4">
        <div class="bg-white rounded-lg shadow-sm p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-black mb-2">Create Your Account</h1>
                <p class="text-black/70">Set up your organisation and get started with Sangathan</p>
            </div>

            @if ($errors->any())
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    <ul class="list-disc list-inside">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form method="POST" action="{{ route('register') }}" class="space-y-8">
                @csrf

                <!-- User Information -->
                <div>
                    <h2 class="text-xl font-semibold text-black mb-4 border-b border-black/20 pb-2">User Information</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label for="user_name" class="block text-sm font-medium text-black mb-2">
                                Full Name *
                            </label>
                            <input 
                                type="text" 
                                name="user_name" 
                                id="user_name" 
                                value="{{ old('user_name') }}"
                                required 
                                class="form-input w-full @error('user_name') border-red-500 @enderror"
                                placeholder="Enter your full name"
                            >
                            @error('user_name')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="user_email" class="block text-sm font-medium text-black mb-2">
                                Email Address *
                            </label>
                            <input 
                                type="email" 
                                name="user_email" 
                                id="user_email" 
                                value="{{ old('user_email') }}"
                                required 
                                class="form-input w-full @error('user_email') border-red-500 @enderror"
                                placeholder="Enter your email address"
                            >
                            @error('user_email')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="user_password" class="block text-sm font-medium text-black mb-2">
                                Password *
                            </label>
                            <input 
                                type="password" 
                                name="user_password" 
                                id="user_password" 
                                required 
                                class="form-input w-full @error('user_password') border-red-500 @enderror"
                                placeholder="Create a strong password"
                            >
                            @error('user_password')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="user_password_confirmation" class="block text-sm font-medium text-black mb-2">
                                Confirm Password *
                            </label>
                            <input 
                                type="password" 
                                name="user_password_confirmation" 
                                id="user_password_confirmation" 
                                required 
                                class="form-input w-full"
                                placeholder="Confirm your password"
                            >
                        </div>

                        <div>
                            <label for="user_phone" class="block text-sm font-medium text-black mb-2">
                                Phone Number
                            </label>
                            <input 
                                type="tel" 
                                name="user_phone" 
                                id="user_phone" 
                                value="{{ old('user_phone') }}"
                                class="form-input w-full @error('user_phone') border-red-500 @enderror"
                                placeholder="Enter your phone number"
                            >
                            @error('user_phone')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="user_designation" class="block text-sm font-medium text-black mb-2">
                                Designation
                            </label>
                            <input 
                                type="text" 
                                name="user_designation" 
                                id="user_designation" 
                                value="{{ old('user_designation') }}"
                                class="form-input w-full @error('user_designation') border-red-500 @enderror"
                                placeholder="Your role/position"
                            >
                            @error('user_designation')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                </div>

                <!-- Organisation Information -->
                <div>
                    <h2 class="text-xl font-semibold text-black mb-4 border-b border-black/20 pb-2">Organisation Information</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="md:col-span-2">
                            <label for="organisation_name" class="block text-sm font-medium text-black mb-2">
                                Organisation Name *
                            </label>
                            <input 
                                type="text" 
                                name="organisation_name" 
                                id="organisation_name" 
                                value="{{ old('organisation_name') }}"
                                required 
                                class="form-input w-full @error('organisation_name') border-red-500 @enderror"
                                placeholder="Enter your organisation name"
                            >
                            @error('organisation_name')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="organisation_type" class="block text-sm font-medium text-black mb-2">
                                Organisation Type *
                            </label>
                            <select 
                                name="organisation_type" 
                                id="organisation_type" 
                                required 
                                class="form-input w-full @error('organisation_type') border-red-500 @enderror"
                            >
                                <option value="">Select organisation type</option>
                                @foreach($organisationTypes as $value => $label)
                                    <option value="{{ $value }}" {{ old('organisation_type') == $value ? 'selected' : '' }}>
                                        {{ $label }}
                                    </option>
                                @endforeach
                            </select>
                            @error('organisation_type')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="organisation_email" class="block text-sm font-medium text-black mb-2">
                                Organisation Email
                            </label>
                            <input 
                                type="email" 
                                name="organisation_email" 
                                id="organisation_email" 
                                value="{{ old('organisation_email') }}"
                                class="form-input w-full @error('organisation_email') border-red-500 @enderror"
                                placeholder="Organisation contact email"
                            >
                            @error('organisation_email')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="organisation_phone" class="block text-sm font-medium text-black mb-2">
                                Organisation Phone
                            </label>
                            <input 
                                type="tel" 
                                name="organisation_phone" 
                                id="organisation_phone" 
                                value="{{ old('organisation_phone') }}"
                                class="form-input w-full @error('organisation_phone') border-red-500 @enderror"
                                placeholder="Organisation contact phone"
                            >
                            @error('organisation_phone')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="organisation_registration_number" class="block text-sm font-medium text-black mb-2">
                                Registration Number
                            </label>
                            <input 
                                type="text" 
                                name="organisation_registration_number" 
                                id="organisation_registration_number" 
                                value="{{ old('organisation_registration_number') }}"
                                class="form-input w-full @error('organisation_registration_number') border-red-500 @enderror"
                                placeholder="Official registration number"
                            >
                            @error('organisation_registration_number')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="organisation_registration_date" class="block text-sm font-medium text-black mb-2">
                                Registration Date
                            </label>
                            <input 
                                type="date" 
                                name="organisation_registration_date" 
                                id="organisation_registration_date" 
                                value="{{ old('organisation_registration_date') }}"
                                class="form-input w-full @error('organisation_registration_date') border-red-500 @enderror"
                            >
                            @error('organisation_registration_date')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="organisation_city" class="block text-sm font-medium text-black mb-2">
                                City
                            </label>
                            <input 
                                type="text" 
                                name="organisation_city" 
                                id="organisation_city" 
                                value="{{ old('organisation_city') }}"
                                class="form-input w-full @error('organisation_city') border-red-500 @enderror"
                                placeholder="City"
                            >
                            @error('organisation_city')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="organisation_state" class="block text-sm font-medium text-black mb-2">
                                State
                            </label>
                            <input 
                                type="text" 
                                name="organisation_state" 
                                id="organisation_state" 
                                value="{{ old('organisation_state') }}"
                                class="form-input w-full @error('organisation_state') border-red-500 @enderror"
                                placeholder="State"
                            >
                            @error('organisation_state')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div>
                            <label for="organisation_postal_code" class="block text-sm font-medium text-black mb-2">
                                Postal Code
                            </label>
                            <input 
                                type="text" 
                                name="organisation_postal_code" 
                                id="organisation_postal_code" 
                                value="{{ old('organisation_postal_code') }}"
                                class="form-input w-full @error('organisation_postal_code') border-red-500 @enderror"
                                placeholder="Postal code"
                            >
                            @error('organisation_postal_code')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="md:col-span-2">
                            <label for="organisation_website" class="block text-sm font-medium text-black mb-2">
                                Website
                            </label>
                            <input 
                                type="url" 
                                name="organisation_website" 
                                id="organisation_website" 
                                value="{{ old('organisation_website') }}"
                                class="form-input w-full @error('organisation_website') border-red-500 @enderror"
                                placeholder="https://www.example.com"
                            >
                            @error('organisation_website')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="md:col-span-2">
                            <label for="organisation_address" class="block text-sm font-medium text-black mb-2">
                                Address
                            </label>
                            <textarea 
                                name="organisation_address" 
                                id="organisation_address" 
                                rows="3"
                                class="form-input w-full @error('organisation_address') border-red-500 @enderror"
                                placeholder="Organisation address"
                            >{{ old('organisation_address') }}</textarea>
                            @error('organisation_address')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="md:col-span-2">
                            <label for="organisation_description" class="block text-sm font-medium text-black mb-2">
                                Description
                            </label>
                            <textarea 
                                name="organisation_description" 
                                id="organisation_description" 
                                rows="4"
                                class="form-input w-full @error('organisation_description') border-red-500 @enderror"
                                placeholder="Brief description of your organisation"
                            >{{ old('organisation_description') }}</textarea>
                            @error('organisation_description')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                            @enderror
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-end space-x-4">
                    <a href="{{ route('login') }}" class="text-orange-600 hover:text-orange-700 font-medium">
                        Already have an account?
                    </a>
                    <button type="submit" class="btn btn-primary">
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection