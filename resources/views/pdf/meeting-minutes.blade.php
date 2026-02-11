@extends('pdf.layout')

@section('title', 'Meeting Minutes - ' . $meeting->title)

@section('content')
<div class="header">
    <div class="organisation-name">{{ $organisation->name }}</div>
    <div class="organisation-type">{{ $organisation->type_display_name }}</div>
</div>

<div class="document-title">Meeting Minutes</div>

<div class="mb-4">
    <table style="border: none; margin: 0;">
        <tr style="border: none;">
            <td style="border: none; padding: 5px 10px 5px 0; font-weight: bold; width: 120px;">Meeting Title:</td>
            <td style="border: none; padding: 5px 0;">{{ $meeting->title }}</td>
        </tr>
        <tr style="border: none;">
            <td style="border: none; padding: 5px 10px 5px 0; font-weight: bold;">Meeting Type:</td>
            <td style="border: none; padding: 5px 0;">{{ ucfirst(str_replace('_', ' ', $meeting->type)) }}</td>
        </tr>
        <tr style="border: none;">
            <td style="border: none; padding: 5px 10px 5px 0; font-weight: bold;">Date & Time:</td>
            <td style="border: none; padding: 5px 0;">{{ $meeting->scheduled_at->format('d/m/Y H:i') }}</td>
        </tr>
        <tr style="border: none;">
            <td style="border: none; padding: 5px 10px 5px 0; font-weight: bold;">Location:</td>
            <td style="border: none; padding: 5px 0;">{{ $meeting->location ?? 'Online' }}</td>
        </tr>
        @if($meeting->description)
        <tr style="border: none;">
            <td style="border: none; padding: 5px 10px 5px 0; font-weight: bold; vertical-align: top;">Description:</td>
            <td style="border: none; padding: 5px 0;">{{ $meeting->description }}</td>
        </tr>
        @endif
    </table>
</div>

@if($meeting->attendees->isNotEmpty())
    <h3 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">Attendees</h3>
    <table>
        <thead>
            <tr>
                <th width="10%">S. No.</th>
                <th width="40%">Name</th>
                <th width="25%">Role</th>
                <th width="25%">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($meeting->attendees as $index => $attendee)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $attendee->name }}</td>
                    <td>{{ $attendee->role ?? 'Member' }}</td>
                    <td>
                        @if($attendee->status === 'attended')
                            <span style="color: green;">Attended</span>
                        @elseif($attendee->status === 'absent')
                            <span style="color: red;">Absent</span>
                        @else
                            <span style="color: orange;">Invited</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endif

@if($meeting->agenda)
    <h3 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">Agenda</h3>
    <div style="border: 1px solid #000; padding: 15px; margin-bottom: 20px;">
        {!! nl2br(e($meeting->agenda)) !!}
    </div>
@endif

@if($meeting->decisions)
    <h3 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">Decisions Taken</h3>
    <div style="border: 1px solid #000; padding: 15px; margin-bottom: 20px;">
        {!! nl2br(e($meeting->decisions)) !!}
    </div>
@endif

@if($meeting->action_points)
    <h3 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">Action Points</h3>
    <div style="border: 1px solid #000; padding: 15px; margin-bottom: 20px;">
        {!! nl2br(e($meeting->action_points)) !!}
    </div>
@endif

<div class="signature-section">
    <table style="border: none; margin-top: 60px;">
        <tr style="border: none;">
            <td style="border: none; width: 50%; text-align: center;">
                <div class="signature-line"></div>
                <div style="margin-top: 10px; font-weight: bold;">Chairperson</div>
            </td>
            <td style="border: none; width: 50%; text-align: center;">
                <div class="signature-line"></div>
                <div style="margin-top: 10px; font-weight: bold;">Secretary</div>
            </td>
        </tr>
    </table>
</div>

<div class="footer">
    <div>Page 1 of 1</div>
    <div>Generated on: {{ $generated_date }}</div>
    @if($show_branding)
        <div>Generated using Sangathan.space</div>
    @endif
</div>
@endsection