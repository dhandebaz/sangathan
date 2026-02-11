@extends('layouts.app')

@section('title', 'Create Form')
@section('page-title', 'Create Form')
@section('page-subtitle', 'Build a new custom form')

@section('content')
<div class="max-w-2xl mx-auto">
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Form Details</h3>
        </div>
        
        <form method="POST" action="{{ route('forms.store') }}" class="card-body space-y-6">
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
            
            <!-- Title -->
            <div>
                <label for="title" class="block text-sm font-medium text-black mb-2">
                    Form Title *
                </label>
                <input 
                    type="text" 
                    name="title" 
                    id="title" 
                    value="{{ old('title') }}"
                    required 
                    autofocus
                    class="form-input w-full @error('title') border-red-500 @enderror"
                    placeholder="e.g., Membership Application, Volunteer Registration"
                >
                @error('title')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Description -->
            <div>
                <label for="description" class="block text-sm font-medium text-black mb-2">
                    Description
                </label>
                <textarea 
                    name="description" 
                    id="description" 
                    rows="3"
                    class="form-input w-full @error('description') border-red-500 @enderror"
                    placeholder="Brief description of what this form is for (optional)"
                >{{ old('description') }}</textarea>
                @error('description')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Visibility -->
            <div>
                <label class="block text-sm font-medium text-black mb-2">Form Visibility</label>
                <div class="space-y-2">
                    <label class="flex items-center">
                        <input type="radio" name="is_public" value="1" {{ old('is_public', false) ? 'checked' : '' }} class="rounded border-gray-300 text-orange-600 focus:ring-orange-500">
                        <span class="ml-2 text-black">Public - Anyone can access via link (no login required)</span>
                    </label>
                    <label class="flex items-center">
                        <input type="radio" name="is_public" value="0" {{ !old('is_public', true) ? 'checked' : '' }} class="rounded border-gray-300 text-orange-600 focus:ring-orange-500">
                        <span class="ml-2 text-black">Internal - Only organisation members can access</span>
                    </label>
                </div>
                @error('is_public')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Status -->
            <div>
                <label class="flex items-center">
                    <input type="checkbox" name="is_active" {{ old('is_active', true) ? 'checked' : '' }} class="rounded border-gray-300 text-orange-600 focus:ring-orange-500">
                    <span class="ml-2 text-black">Activate form immediately</span>
                </label>
                <p class="text-xs text-black/70 mt-1">You can change this later in form settings</p>
                @error('is_active')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
            
            <!-- Action Buttons -->
            <div class="flex items-center justify-end space-x-4 pt-4">
                <a href="{{ route('forms.index') }}" class="btn btn-secondary">
                    Cancel
                </a>
                <button type="submit" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Create Form
                </button>
            </div>
        </form>
    </div>
</div>
@endsection