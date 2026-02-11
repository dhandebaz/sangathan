@extends('layouts.public')

@section('title', 'Form Submitted - ' . $form->title)

@section('content')
<div class="min-h-screen flex items-center justify-center bg-orange-500">
    <div class="max-w-md w-full mx-4">
        <div class="bg-white rounded-lg shadow-sm p-8 text-center">
            <div class="mb-6">
                <svg class="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 class="text-2xl font-bold text-black mb-2">Form Submitted Successfully!</h1>
                <p class="text-black/70">Thank you for submitting the form.</p>
            </div>

            <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p class="text-green-800 text-sm">
                    Your response has been recorded and will be reviewed by {{ $organisation->name }}.
                </p>
            </div>

            <div class="space-y-3">
                <p class="text-sm text-black/60">
                    If you have any questions, please contact {{ $organisation->name }} directly.
                </p>
                
                <div class="flex items-center justify-center space-x-4 pt-4">
                    <button onclick="window.print()" class="btn btn-secondary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                        </svg>
                        Print
                    </button>
                    <a href="{{ route('public.forms.show', ['organisation' => $organisation->slug, 'form' => $form->id]) }}" class="btn btn-primary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Submit Another Response
                    </a>
                </div>
            </div>

            <div class="mt-6 pt-6 border-t border-black/20">
                <p class="text-xs text-black/50">
                    Form submitted to {{ $organisation->name }} • 
                    <a href="{{ route('public.forms.show', ['organisation' => $organisation->slug, 'form' => $form->id]) }}" class="text-orange-600 hover:text-orange-700">
                        Back to form
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
@endsection