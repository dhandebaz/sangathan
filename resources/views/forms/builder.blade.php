@extends('layouts.app')

@section('title', 'Form Builder - ' . $form->title)
@section('page-title', 'Form Builder')
@section('page-subtitle', $form->title)

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Form Builder</h1>
            <p class="text-black/70">Drag and drop to build your form</p>
        </div>
        
        <div class="flex items-center space-x-3">
            <a href="{{ route('forms.index') }}" class="btn btn-secondary">
                Back to Forms
            </a>
            <button onclick="saveFormOrder()" class="btn btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Order
            </button>
        </div>
    </div>

    <!-- Form Settings -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Form Settings</h3>
        </div>
        <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-black mb-2">Title</label>
                    <input type="text" value="{{ $form->title }}" class="form-input w-full" readonly>
                </div>
                <div>
                    <label class="block text-sm font-medium text-black mb-2">Status</label>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        {{ $form->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                        {{ $form->is_active ? 'Active' : 'Inactive' }}
                    </span>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-black mb-2">Description</label>
                    <textarea class="form-input w-full" rows="2" readonly>{{ $form->description }}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-black mb-2">Visibility</label>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        {{ $form->is_public ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800' }}">
                        {{ $form->is_public ? 'Public' : 'Internal' }}
                    </span>
                </div>
                <div>
                    <label class="block text-sm font-medium text-black mb-2">Public URL</label>
                    <div class="flex">
                        <input type="text" value="{{ $form->public_url }}" class="form-input flex-1 text-sm" readonly>
                        <button onclick="copyPublicUrl()" class="btn btn-secondary ml-2">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Field Section -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Add New Field</h3>
        </div>
        <div class="card-body">
            <form id="addFieldForm" class="space-y-4">
                @csrf
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="field_label" class="block text-sm font-medium text-black mb-2">Field Label *</label>
                        <input type="text" id="field_label" name="label" class="form-input w-full" required>
                    </div>
                    <div>
                        <label for="field_type" class="block text-sm font-medium text-black mb-2">Field Type *</label>
                        <select id="field_type" name="field_type" class="form-input w-full" required onchange="toggleOptionsField()">
                            <option value="">Select type</option>
                            <option value="text">Text Input</option>
                            <option value="textarea">Text Area</option>
                            <option value="email">Email</option>
                            <option value="phone">Phone Number</option>
                            <option value="number">Number</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="date">Date</option>
                            <option value="file">File Upload</option>
                        </select>
                    </div>
                </div>
                
                <div id="optionsField" class="hidden">
                    <label class="block text-sm font-medium text-black mb-2">Options (one per line)</label>
                    <textarea id="field_options" name="options" class="form-input w-full" rows="3" placeholder="Option 1&#10;Option 2&#10;Option 3"></textarea>
                    <p class="text-xs text-black/70 mt-1">For dropdown and checkbox fields</p>
                </div>
                
                <div class="flex items-center">
                    <input type="checkbox" id="field_required" name="is_required" class="rounded border-gray-300 text-orange-600 focus:ring-orange-500">
                    <label for="field_required" class="ml-2 text-sm font-medium text-black">Required field</label>
                </div>
                
                <div class="flex items-center justify-end space-x-4">
                    <button type="button" onclick="resetAddFieldForm()" class="btn btn-secondary">Clear</button>
                    <button type="submit" class="btn btn-primary">Add Field</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Existing Fields -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Form Fields ({{ $form->fields->count() }})</h3>
        </div>
        <div class="card-body">
            <div id="fieldsList" class="space-y-3">
                @forelse($form->fields as $field)
                    <div class="field-item bg-orange-50 border border-orange-200 rounded-lg p-4" data-field-id="{{ $field->id }}" data-position="{{ $field->position }}">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <div class="drag-handle cursor-move text-black/50">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h4 class="font-medium text-black">{{ $field->label }}</h4>
                                    <p class="text-sm text-black/70">{{ $field->type_display }}</p>
                                    @if($field->is_required)
                                        <span class="text-xs text-red-600">Required</span>
                                    @endif
                                </div>
                            </div>
                            <button onclick="deleteField({{ $field->id }})" class="text-red-600 hover:text-red-700 p-1">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                @empty
                    <div class="text-center py-8">
                        <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        <h3 class="text-lg font-medium text-black mb-2">No fields yet</h3>
                        <p class="text-black/70">Add your first field using the form above.</p>
                    </div>
                @endforelse
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
let formFields = @json($form->fields->pluck('id'));

function toggleOptionsField() {
    const fieldType = document.getElementById('field_type').value;
    const optionsField = document.getElementById('optionsField');
    
    if (fieldType === 'dropdown' || fieldType === 'checkbox') {
        optionsField.classList.remove('hidden');
    } else {
        optionsField.classList.add('hidden');
    }
}

function resetAddFieldForm() {
    document.getElementById('addFieldForm').reset();
    document.getElementById('optionsField').classList.add('hidden');
}

document.getElementById('addFieldForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    
    // Process options
    const optionsText = formData.get('options');
    if (optionsText) {
        const options = optionsText.split('\n').filter(opt => opt.trim() !== '');
        formData.set('options', JSON.stringify(options));
    } else {
        formData.delete('options');
    }
    
    try {
        const response = await fetch('{{ route("forms.add-field", $form) }}', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Accept': 'application/json',
            },
            body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
            location.reload();
        } else {
            if (data.errors) {
                alert('Validation errors: ' + JSON.stringify(data.errors));
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
});

async function deleteField(fieldId) {
    if (!confirm('Are you sure you want to delete this field?')) {
        return;
    }
    
    try {
        const response = await fetch(`{{ route('forms.delete-field', [$form, 'field' => '__field_id__']) }}`.replace('__field_id__', fieldId), {
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Accept': 'application/json',
            },
        });
        
        if (response.ok) {
            location.reload();
        } else {
            alert('Failed to delete field. Please try again.');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

async function saveFormOrder() {
    const fieldItems = document.querySelectorAll('.field-item');
    const fieldIds = Array.from(fieldItems).map(item => item.dataset.fieldId);
    
    try {
        const response = await fetch('{{ route("forms.update-field-order", $form) }}', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ field_ids: fieldIds }),
        });
        
        if (response.ok) {
            alert('Field order saved successfully!');
        } else {
            alert('Failed to save field order. Please try again.');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

function copyPublicUrl() {
    const urlInput = document.querySelector('input[value="{{ $form->public_url }}"]');
    urlInput.select();
    document.execCommand('copy');
    alert('Public URL copied to clipboard!');
}

// Initialize drag and drop for field reordering
document.addEventListener('DOMContentLoaded', function() {
    const fieldsList = document.getElementById('fieldsList');
    if (fieldsList) {
        // Simple drag and drop implementation
        let draggedElement = null;
        
        fieldsList.addEventListener('dragstart', function(e) {
            if (e.target.classList.contains('field-item')) {
                draggedElement = e.target;
                e.target.style.opacity = '0.5';
            }
        });
        
        fieldsList.addEventListener('dragend', function(e) {
            if (e.target.classList.contains('field-item')) {
                e.target.style.opacity = '';
            }
        });
        
        fieldsList.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        fieldsList.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedElement && e.target.closest('.field-item')) {
                const targetElement = e.target.closest('.field-item');
                if (targetElement !== draggedElement) {
                    const allFields = Array.from(fieldsList.children);
                    const draggedIndex = allFields.indexOf(draggedElement);
                    const targetIndex = allFields.indexOf(targetElement);
                    
                    if (draggedIndex < targetIndex) {
                        targetElement.parentNode.insertBefore(draggedElement, targetElement.nextSibling);
                    } else {
                        targetElement.parentNode.insertBefore(draggedElement, targetElement);
                    }
                }
            }
        });
        
        // Make field items draggable
        document.querySelectorAll('.field-item').forEach(item => {
            item.draggable = true;
        });
    }
});
</script>
@endpush
@endsection