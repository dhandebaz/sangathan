@extends('layouts.app')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')
@section('page-subtitle', 'Welcome to your Sangathan dashboard')

@section('content')
<div class="space-y-6">
    <!-- User and Organisation Info -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- User Information -->
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">User Information</h3>
            </div>
            <div class="card-body">
                <div class="space-y-3">
                    <div class="flex items-center space-x-3">
                        <div class="avatar-sm">{{ substr(auth()->user()->name, 0, 2) }}</div>
                        <div>
                            <p class="font-medium text-black">{{ auth()->user()->name }}</p>
                            <p class="text-sm text-black/70">{{ auth()->user()->email }}</p>
                        </div>
                    </div>
                    @if(auth()->user()->designation)
                        <div>
                            <p class="text-sm font-medium text-black">Designation</p>
                            <p class="text-sm text-black/70">{{ auth()->user()->designation }}</p>
                        </div>
                    @endif
                    @if(auth()->user()->phone)
                        <div>
                            <p class="text-sm font-medium text-black">Phone</p>
                            <p class="text-sm text-black/70">{{ auth()->user()->phone }}</p>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Current Organisation -->
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">Current Organisation</h3>
            </div>
            <div class="card-body">
                @php
                    $currentOrganisation = auth()->user()->organisations()->where('organisation_id', session('current_organisation_id'))->first();
                    $role = $currentOrganisation ? $currentOrganisation->pivot->role : null;
                @endphp
                
                @if($currentOrganisation)
                    <div class="space-y-3">
                        <div>
                            <p class="font-medium text-black">{{ $currentOrganisation->name }}</p>
                            <p class="text-sm text-black/70">{{ $currentOrganisation->type_display_name }}</p>
                        </div>
                        @if($role)
                            <div>
                                <p class="text-sm font-medium text-black">Your Role</p>
                                <p class="text-sm text-black/70">{{ ucfirst($role->name) }}</p>
                            </div>
                        @endif
                        @if($currentOrganisation->email)
                            <div>
                                <p class="text-sm font-medium text-black">Contact Email</p>
                                <p class="text-sm text-black/70">{{ $currentOrganisation->email }}</p>
                            </div>
                        @endif
                    </div>
                @else
                    <p class="text-black/70">No organisation selected</p>
                @endif
            </div>
        </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card">
            <div class="card-body">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-black">Users in Org</p>
                        <p class="text-2xl font-semibold text-black">
                            {{ $currentOrganisation ? $currentOrganisation->users()->count() : 0 }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-black">Your Organisations</p>
                        <p class="text-2xl font-semibold text-black">{{ auth()->user()->organisations()->count() }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-black">Members</p>
                        <p class="text-2xl font-semibold text-black">
                            @php
                                $memberCount = 0;
                                if($currentOrganisation) {
                                    $memberCount = \App\Models\Member::forOrganisation($currentOrganisation->id)->count();
                                }
                            @endphp
                            {{ $memberCount }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-black">Member Since</p>
                        <p class="text-2xl font-semibold text-black">{{ auth()->user()->created_at->diffForHumans() }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Actions -->
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">Quick Actions</h3>
            </div>
            <div class="card-body">
                <div class="space-y-3">
                    @can('create', App\Models\Member::class)
                        <a href="{{ route('members.create') }}" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                            <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                            </div>
                            <div class="flex-1">
                                <p class="font-medium text-black">Add New Member</p>
                                <p class="text-sm text-black/70">Register a new member in your organisation</p>
                            </div>
                        </a>
                    @endcan
                    
                    <a href="{{ route('members.index') }}" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                        <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                            </svg>
                        </div>
                        <div class="flex-1">
                            <p class="font-medium text-black">View Member Register</p>
                            <p class="text-sm text-black/70">Browse and manage organisation members</p>
                        </div>
                    </a>
                    
                    <a href="#" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <div class="flex-1">
                            <p class="font-medium text-black">Organisation Settings</p>
                            <p class="text-sm text-black/70">Update your organisation details</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <!-- System Status -->
        <div class="card">
            <div class="card-header">
                <h3 class="text-lg font-medium text-black">System Status</h3>
            </div>
            <div class="card-body">
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-black">Authentication</span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-black">Organisation Context</span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Set
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-black">Role Assignment</span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {{ $role ? ucfirst($role->name) : 'None' }}
                        </span>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-black">Installation Status</span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Complete
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection