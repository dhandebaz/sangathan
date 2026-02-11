@extends('layouts.app')

@section('title', 'Donations')
@section('page-title', 'Donation Register')
@section('page-subtitle', 'Manage organisation donations')

@section('content')
<div class="space-y-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 class="text-2xl font-bold text-black">Donation Register</h1>
            <p class="text-black/70">Manage organisation donations and payment claims</p>
        </div>
        
        <div class="flex items-center gap-3">
            <a href="{{ route('export.donations.pdf') }}" class="btn btn-secondary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Export PDF
            </a>
            
            @can('create', App\Models\Donation::class)
                <a href="{{ route('donations.create') }}" class="btn btn-primary">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Donation
                </a>
            @endcan
        </div>
    </div>

    <!-- Filter Section -->
    <div class="card">
        <div class="card-body">
            <form method="GET" action="{{ route('donations.index') }}" class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                    <label for="search" class="block text-sm font-medium text-black mb-2">Search</label>
                    <input 
                        type="text" 
                        name="search" 
                        id="search" 
                        value="{{ request('search') }}"
                        class="form-input w-full"
                        placeholder="Search by donor name, email, phone, or reference ID..."
                    >
                </div>
                
                <div class="flex-1">
                    <label for="start_date" class="block text-sm font-medium text-black mb-2">Start Date</label>
                    <input type="date" name="start_date" id="start_date" value="{{ request('start_date') }}" class="form-input w-full">
                </div>
                
                <div class="flex-1">
                    <label for="end_date" class="block text-sm font-medium text-black mb-2">End Date</label>
                    <input type="date" name="end_date" id="end_date" value="{{ request('end_date') }}" class="form-input w-full">
                </div>
                
                <div class="flex items-end">
                    <button type="submit" class="btn btn-secondary w-full">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        Search
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Donations Table -->
    <div class="card">
        <div class="card-body">
            @if($donations->count() > 0)
                <div class="overflow-x-auto">
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="border-b border-black">
                                <th class="text-left py-3 px-4 font-semibold text-black">Date</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Donor Name</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Amount</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Mode</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Reference ID</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Purpose</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Received By</th>
                                <th class="text-left py-3 px-4 font-semibold text-black">Source</th>
                                <th class="text-right py-3 px-4 font-semibold text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @php
                                $totalAmount = 0;
                            @endphp
                            @foreach($donations as $donation)
                                @php
                                    $totalAmount += $donation->amount;
                                @endphp
                                <tr class="border-b border-black/20 hover:bg-orange-50">
                                    <td class="py-3 px-4 text-black">
                                        {{ $donation->created_at->format('d M Y') }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <div class="font-medium">{{ $donation->donor_name }}</div>
                                        @if($donation->donor_email)
                                            <div class="text-sm text-black/70">{{ $donation->donor_email }}</div>
                                        @endif
                                    </td>
                                    <td class="py-3 px-4 text-black font-semibold">
                                        ₹{{ number_format($donation->amount, 2) }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {{ ucfirst(str_replace('_', ' ', $donation->mode)) }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $donation->reference_id ?? 'N/A' }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $donation->purpose ?? 'General' }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        {{ $donation->received_by ?? 'N/A' }}
                                    </td>
                                    <td class="py-3 px-4 text-black">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            @if($donation->source === 'manual') bg-blue-100 text-blue-800
                                            @elseif($donation->source === 'payment_claim') bg-green-100 text-green-800
                                            @else bg-gray-100 text-gray-800
                                            @endif">
                                            {{ ucfirst(str_replace('_', ' ', $donation->source)) }}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-right">
                                        <div class="flex items-center justify-end space-x-2">
                                            <a href="{{ route('donations.show', $donation) }}" class="text-blue-600 hover:text-blue-700 p-1" title="View Details">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                                </svg>
                                            </a>
                                            
                                            @can('update', $donation)
                                                <a href="{{ route('donations.edit', $donation) }}" class="text-orange-600 hover:text-orange-700 p-1" title="Edit">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                    </svg>
                                                </a>
                                            @endcan
                                            
                                            @can('delete', $donation)
                                                <form method="POST" action="{{ route('donations.destroy', $donation) }}" class="inline" onsubmit="return confirm('Are you sure you want to delete this donation?');">
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
                        <tfoot>
                            <tr class="border-t-2 border-black">
                                <td colspan="2" class="py-3 px-4 text-black font-bold">Total</td>
                                <td class="py-3 px-4 text-black font-bold">₹{{ number_format($totalAmount, 2) }}</td>
                                <td colspan="6"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="mt-6">
                    {{ $donations->appends(request()->query())->links() }}
                </div>
            @else
                <div class="text-center py-8">
                    <svg class="w-12 h-12 text-black/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-black mb-2">No donations found</h3>
                    <p class="text-black/70 mb-4">No donations have been recorded yet.</p>
                    @can('create', App\Models\Donation::class)
                        <a href="{{ route('donations.create') }}" class="btn btn-primary">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add First Donation
                        </a>
                    @endcan
                </div>
            @endif
        </div>
    </div>
</div>
@endsection