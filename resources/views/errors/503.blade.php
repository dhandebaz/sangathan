@extends('layouts.app')

@section('title', 'Service Unavailable')

@section('content')
<div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">503</h1>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Maintenance Mode</h2>
        <p class="text-gray-600 mb-8">We are currently performing scheduled maintenance. Please check back shortly.</p>
        <div class="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
</div>
@endsection
