@extends('pdf.layout')

@section('title', 'Donation Register - ' . $organisation->name)

@section('content')
<div class="header">
    <div class="organisation-name">{{ $organisation->name }}</div>
    <div class="organisation-type">{{ $organisation->type_display_name }}</div>
</div>

<div class="document-title">Donation Register</div>
<div class="document-info">
    <div>Date Range: {{ $date_range }}</div>
    <div>Generated on: {{ $generated_date }}</div>
</div>

@if($donations->isEmpty())
    <p>No donations found for the selected date range.</p>
@else
    <table>
        <thead>
            <tr>
                <th width="12%">Date</th>
                <th width="25%">Donor Name</th>
                <th width="12%">Amount (₹)</th>
                <th width="15%">Mode</th>
                <th width="18%">Reference ID</th>
                <th width="18%">Purpose</th>
                <th width="15%">Received By</th>
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
                <tr>
                    <td>{{ $donation->created_at->format('d/m/Y') }}</td>
                    <td>{{ $donation->donor_name }}</td>
                    <td style="text-align: right;">₹{{ number_format($donation->amount, 2) }}</td>
                    <td>{{ ucfirst(str_replace('_', ' ', $donation->mode)) }}</td>
                    <td>{{ $donation->reference_id ?? 'N/A' }}</td>
                    <td>{{ $donation->purpose ?? 'General' }}</td>
                    <td>{{ $donation->received_by ?? 'N/A' }}</td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr style="font-weight: bold;">
                <td colspan="2">Total</td>
                <td style="text-align: right;">₹{{ number_format($totalAmount, 2) }}</td>
                <td colspan="4"></td>
            </tr>
        </tfoot>
    </table>
@endif

<div class="disclaimer">
    <strong>Important:</strong> This document is a record of donations received. Sangathan does not process payments. All donations are made directly to the organisation.
</div>

<div class="footer">
    <div>Page 1 of 1</div>
    @if($show_branding)
        <div>Generated using Sangathan.space</div>
    @endif
</div>
@endsection