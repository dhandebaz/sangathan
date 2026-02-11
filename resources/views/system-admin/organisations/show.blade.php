@extends('layouts.system-admin')

@section('title', 'Organisation Details - ' . $organisation->name)
@section('page-title', 'Organisation Details')
@section('page-subtitle', $organisation->name)

@section('content')
<div class="space-y-6">
    <!-- Organisation Header -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Organisation Information</h3>
        </div>
        <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <p class="text-sm font-medium text-black">Name</p>
                    <p class="text-black">{{ $organisation->name }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Type</p>
                    <p class="text-black">{{ $organisation->type_display_name }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Email</p>
                    <p class="text-black">{{ $organisation->email ?? 'Not provided' }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Phone</p>
                    <p class="text-black">{{ $organisation->phone ?? 'Not provided' }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Created</p>
                    <p class="text-black">{{ $organisation->created_at->format('d M Y, h:i A') }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Last Updated</p>
                    <p class="text-black">{{ $organisation->updated_at->format('d M Y, h:i A') }}</p>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Status</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        @if($organisation->is_suspended) bg-red-100 text-red-800
                        @else bg-green-100 text-green-800
                        @endif">
                        {{ $organisation->is_suspended ? 'Suspended' : 'Active' }}
                    </span>
                </div>
                <div>
                    <p class="text-sm font-medium text-black">Supporter Status</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        @if($organisation->is_supporter) bg-yellow-100 text-yellow-800
                        @else bg-gray-100 text-gray-800
                        @endif">
                        {{ $organisation->is_supporter ? 'Supporter' : 'Regular' }}
                    </span>
                </div>
            </div>
            
            @if($organisation->description)
                <div class="mt-4">
                    <p class="text-sm font-medium text-black">Description</p>
                    <p class="text-black">{{ $organisation->description }}</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Total Users</p>
                <p class="text-2xl font-bold text-black">{{ $organisation->users_count }}</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Total Members</p>
                <p class="text-2xl font-bold text-black">{{ $organisation->members_count }}</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Total Forms</p>
                <p class="text-2xl font-bold text-black">{{ $organisation->forms_count }}</p>
            </div>
        </div>
        <div class="card">
            <div class="card-body text-center">
                <p class="text-sm font-medium text-black">Total Meetings</p>
                <p class="text-2xl font-bold text-black">{{ $organisation->meetings_count }}</p>
            </div>
        </div>
    </div>

    <!-- Actions -->
    <div class="card">
        <div class="card-header">
            <h3 class="text-lg font-medium text-black">Actions</h3>
        </div>
        <div class="card-body">
            <div class="flex flex-wrap gap-3">
                @if($organisation->is_suspended)
                    <form method="POST" action="{{ route('system-admin.organisations.unsuspend', $organisation) }}" class="inline" onsubmit="return confirm('Are you sure you want to unsuspend this organisation?');">
                        @csrf
                        <button type="submit" class="btn btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Unsuspend Organisation
                        </button>
                    </form>
                @else
                    <form method="POST" action="{{ route('system-admin.organisations.suspend', $organisation) }}" class="inline" onsubmit="return confirm('Are you sure you want to suspend this organisation? This will prevent all users from logging in.');">
                        @csrf
                        <button type="submit" class="btn btn-danger">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                            </svg>
                            Suspend Organisation
                        </button>
                    </form>
                @endif
                
                <form method="POST" action="{{ route('system-admin.organisations.toggle-supporter', $organisation) }}" class="inline" onsubmit="return confirm('Are you sure you want to toggle supporter status for this organisation?');">
                    @csrf
                    <button type="submit" class="btn btn-secondary">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Toggle Supporter Status
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection