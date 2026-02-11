@extends('pdf.layout')

@section('title', 'Member Register - ' . $organisation->name)

@section('content')
<div class="header">
    <div class="organisation-name">{{ $organisation->name }}</div>
    <div class="organisation-type">{{ $organisation->type_display_name }}</div>
</div>

<div class="document-title">Member Register</div>
<div class="document-info">Generated on: {{ $generated_date }}</div>

@if($members->isEmpty())
    <p>No members found in this organisation.</p>
@else
    <table>
        <thead>
            <tr>
                <th width="8%">S. No.</th>
                <th width="25%">Full Name</th>
                <th width="15%">Phone Number</th>
                <th width="15%">Role</th>
                <th width="20%">Area/District</th>
                <th width="12%">Joining Date</th>
                <th width="10%">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($members as $index => $member)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $member->name }}</td>
                    <td>{{ $member->phone ?? 'N/A' }}</td>
                    <td>{{ $member->role ?? 'Member' }}</td>
                    <td>{{ $member->area ?? $member->district ?? 'N/A' }}</td>
                    <td>{{ $member->created_at->format('d/m/Y') }}</td>
                    <td>
                        @if($member->is_active)
                            <span style="color: green;">Active</span>
                        @else
                            <span style="color: red;">Inactive</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif

<div class="footer">
    <div>Page 1 of 1</div>
    @if($show_branding)
        <div>Generated using Sangathan.space</div>
    @endif
</div>
@endsection