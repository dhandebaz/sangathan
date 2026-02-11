@extends('layouts.app')

@section('title', 'Forms')
@section('page-title', 'Form Builder')
@section('page-subtitle', 'Create and manage custom forms')

@section('content')
<div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Forms</h1>
            <p class="text-black/70">Create custom forms for your organisation</p>
        </div>
        
        @can('create', App\Models\Form::class)
            <a href="{{ route('forms.create') }}" class="btn btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Form
            </a>
        @endcan
    </div>

    <!-- Forms Table -->
    <div class="card">
        <div class="card-body">
            @if($forms->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Title</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Description</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Fields</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Submissions</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Status</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Visibility</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($forms as $form)
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $form->title }}</div>
                                        <div class="text-sm text-black/70">{{ $form->created_at->format('d M Y') }}</div>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ Str::limit($form->description, 50) }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $form->fields->count() }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $form->submission_count }}
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            {{ $form->is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800' }}">
                                            {{ $form->is_active ? 'Active' : 'Inactive' }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            {{ $form->is_public ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800' }}">
                                            {{ $form->is_public ? 'Public' : 'Internal' }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <a href="{{ route('forms.submissions.index', $form) }}" class="text-blue-600 hover:text-blue-700 p-1" title="View Submissions">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                                </svg>
                                            </a>
                                            
                                            @can('update', $form)
                                                <a href="{{ route('forms.builder', $form) }}" class="text-orange-600 hover:text-orange-700 p-1" title="Build Form">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </a>
                                                
                                                <a href="{{ route('forms.edit', $form) }}" class="text-green-600 hover:text-green-700 p-1" title="Edit Settings">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    </svg>
                                                </a>
                                            @endcan
                                            
                                            @can('delete', $form)
                                                <form method="POST" action="{{ route('forms.destroy', $form) }}" class="inline" onsubmit="return confirm('Are you sure you want to delete this form? This will also delete all submissions.');">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="text-red-600 hover:text-red-700 p-1" title="Delete">
                                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                        </svg>
                                                    </button>
                                                </form>
                                            @endcan
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="mt-6">
                    {{ $forms->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No forms created yet</h3>
                    <p class="text-black/70 mb-4">Get started by creating your first form.</p>
                    @can('create', App\Models\Form::class)
                        <a href="{{ route('forms.create') }}" class="btn btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Create First Form
                        </a>
                    @endcan
                </div>
            @endif
        </div>
    </div>
</div>
@endsection