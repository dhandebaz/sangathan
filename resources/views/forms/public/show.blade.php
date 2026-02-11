@extends('layouts.public')

@section('title', $form->title)

@section('content')
<div class="min-h-screen flex items-center justify-center bg-orange-500">
    <div class="max-w-2xl w-full mx-4">
        <div class="bg-white rounded-lg shadow-sm p-8">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-black mb-2">{{ $form->title }}</h1>
                @if($form->description)
                    <p class="text-black/70">{{ $form->description }}</p>
                @endif
                <div class="mt-4 text-sm text-black/60">
                    Powered by {{ config('app.name', 'Sangathan') }} - {{ $organisation->name }}
                </div>
            </div>

            @if (session('success'))
                <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                    {{ session('success') }}
                </div>
            @endif

            @if ($errors->any())
                <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    <ul class="list-disc list-inside">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Form -->
            <form method="POST" action="{{ route('public.forms.submit', ['organisation' => $organisation->slug, 'form' => $form->id]) }}" enctype="multipart/form-data" class="space-y-6">
                @csrf

                @forelse($form->fields as $field)
                    <div>
                        <label for="field_{{ $field->id }}" class="block text-sm font-medium text-black mb-2">
                            {{ $field->label }}
                            @if($field->is_required)
                                <span class="text-red-600">*</span>
                            @endif
                        </label>

                        @switch($field->field_type)
                            @case('text')
                                <input 
                                    type="text" 
                                    name="field_{{ $field->id }}" 
                                    id="field_{{ $field->id }}"
                                    value="{{ old('field_' . $field->id) }}"
                                    @if($field->is_required) required @endif
                                    class="form-input w-full @error('field_' . $field->id) border-red-500 @enderror"
                                    placeholder="Enter {{ strtolower($field->label) }}"
                                >
                                @break

                            @case('textarea')
                                <textarea 
                                    name="field_{{ $field->id }}" 
                                    id="field_{{ $field->id }}"
                                    @if($field->is_required) required @endif
                                    rows="4"
                                    class="form-input w-full @error('field_' . $field->id) border-red-500 @enderror"
                                    placeholder="Enter {{ strtolower($field->label) }}"
                                >{{ old('field_' . $field->id) }}</textarea>
                                @break

                            @case('email')
                                <input 
                                    type="email" 
                                    name="field_{{ $field->id }}" 
                                    id="field_{{ $field->id }}"
                                    value="{{ old('field_' . $field->id) }}"
                                    @if($field->is_required) required @endif
                                    class="form-input w-full @error('field_' . $field->id) border-red-500 @enderror"
                                    placeholder="Enter email address"
                                >
                                @break

                            @case('phone')
                                <input 
                                    type="tel" 
                                    name="field_{{ $field->id }}" 
                                    id="field_{{ $field->id }}"
                                    value="{{ old('field_' . $field->id) }}"
                                    @if($field->is_required) required @endif
                                    class="form-input w-full @error('field_' . $field->id) border-red-500 @enderror"
                                    placeholder="Enter 10-digit phone number"
                                    pattern="[6-9]\d{9}"
                                >
                                @break

                            @case('number')
                                <input 
                                    type="number" 
                                    name="field_{{ $field->id }}" 
                                    id="field_{{ $field->id }}"
                                    value="{{ old('field_' . $field->id) }}"
                                    @if($field->is_required) required @endif
                                    class="form-input w-full @error('field_' . $field->id) border-red-500 @enderror"
                                    placeholder="Enter number"
                                >
                                @break

                            @case('date')
                                <input 
                                    type="date" 
                                    name="field_{{ $field->id }}" 
                                    id="field_{{ $field->id }}"
                                    value="{{ old('field_' . $field->id) }}"
                                    @if($field->is_required) required @endif
                                    class="form-input w-full @error('field_' . $field->id) border-red-500 @enderror"
                                >
                                @break

                            @case('dropdown')
                                <select 
                                    name="field_{{ $field->id }}" 
                                    id="field_{{ $field->id }}"
                                    @if($field->is_required) required @endif
                                    class="form-input w-full @error('field_' . $field->id) border-red-500 @enderror"
                                >
                                    <option value="">Select {{ strtolower($field->label) }}</option>
                                    @foreach($field->getOptionsArray() as $option)
                                        <option value="{{ $option }}" {{ old('field_' . $field->id) == $option ? 'selected' : '' }}>
                                            {{ $option }}
                                        </option>
                                    @endforeach
                                </select>
                                @break

                            @case('checkbox')
                                <div class="space-y-2">
                                    @foreach($field->getOptionsArray() as $option)
                                        <label class="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                name="field_{{ $field->id }}[]" 
                                                value="{{ $option }}"
                                                @if(is_array(old('field_' . $field->id)) && in_array($option, old('field_' . $field->id))) checked @endif
                                                class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                            >
                                            <span class="ml-2 text-black">{{ $option }}</span>
                                        </label>
                                    @endforeach
                                </div>
                                @break

                            @case('file')
                                <input 
                                    type="file" 
                                    name="field_{{ $field->id }}" 
                                    id="field_{{ $field->id }}"
                                    @if($field->is_required) required @endif
                                    class="form-input w-full @error('field_' . $field->id) border-red-500 @enderror"
                                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                                >
                                <p class="text-xs text-black/70 mt-1">Allowed: JPG, PNG, PDF, DOC, XLS (Max 10MB)</p>
                                @break
                        @endswitch

                        @error('field_' . $field->id)
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>
                @empty
                    <div class="text-center py-8">
                        <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-black mb-2">Form has no fields</h3>
                        <p class="text-black/70">This form is still being built. Please check back later.</p>
                    </div>
                @endforelse

                @if($form->fields->count() > 0)
                    <!-- Submit Button -->
                    <div class="pt-6">
                        <button type="submit" class="btn btn-primary w-full">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Submit Form
                        </button>
                    </div>
                @endif
            </form>

            <!-- Footer -->
            <div class="mt-8 pt-6 border-t border-black/20 text-center">
                <p class="text-sm text-black/60">
                    Secure form submission • Your data is protected
                </p>
            </div>
        </div>
    </div>
</div>
@endsection