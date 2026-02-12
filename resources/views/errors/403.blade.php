@extends('layouts.app')

@section('title', 'Forbidden')

@section('content')
<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
        <h1 class="text-6xl font-extrabold text-red-500 mb-4">403</h1>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Access Forbidden</h2>
        <p class="text-gray-600 mb-8">You do not have permission to access this resource.</p>
        <a href="{{ route('dashboard') }}" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            Go to Dashboard
        </a>
    </div>
</div>
@endsection
