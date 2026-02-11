@extends('layouts.public')

@section('title', 'Login')

@section('content')
<div class="min-h-screen flex items-center justify-center bg-orange-500">
    <div class="max-w-md w-full mx-4">
        <div class="bg-white rounded-lg shadow-sm p-8">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-black mb-2">Welcome to Sangathan</h1>
                <p class="text-black/70">Sign in to your account</p>
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

            <form method="POST" action="{{ route('login') }}" class="space-y-6">
                @csrf

                <div>
                    <label for="email" class="block text-sm font-medium text-black mb-2">
                        Email Address
                    </label>
                    <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value="{{ old('email') }}"
                        required 
                        autofocus
                        class="form-input w-full @error('email') border-red-500 @enderror"
                        placeholder="Enter your email"
                    >
                    @error('email')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-black mb-2">
                        Password
                    </label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
                        required 
                        class="form-input w-full @error('password') border-red-500 @enderror"
                        placeholder="Enter your password"
                    >
                    @error('password')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }} class="rounded border-gray-300 text-orange-600 focus:ring-orange-500">
                        <span class="ml-2 text-sm text-black">Remember me</span>
                    </label>
                </div>

                <button type="submit" class="btn btn-primary w-full">
                    Sign In
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-black/70">
                    Don't have an account? 
                    <a href="{{ route('register') }}" class="text-orange-600 hover:text-orange-700 font-medium">
                        Create one here
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection