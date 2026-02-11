@extends('pdf.layout')

@section('title', 'Form Submission - ' . $submission->form->title)

@section('content')
<div class="header">
    <div class="organisation-name">{{ $organisation->name }}</div>
    <div class="organisation-type">{{ $organisation->type_display_name }}</div>
</div>

<div class="document-title">Form Submission Details</div>

<div class="document-info">
    <div>Form: {{ $submission->form->title }}</div>
    <div>Submitted on: {{ $submission->created_at->format('d/m/Y H:i') }}</div>
    <div>Generated on: {{ $generated_date }}</div>
</div>

@if($submission->form->description)
    <div style="border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
        <strong>Form Description:</strong><br>
        {{ $submission->form->description }}
    </div>
@endif

<h3 style="font-size: 14px; font-weight: bold; margin: 20px 0 10px 0;">Submission Details</h3>

<table>
    <tbody>
        @foreach($submission->values as $value)
            @if($value->field)
                <tr>
                    <td width="30%" style="font-weight: bold;">{{ $value->field->label }}</td>
                    <td>
                        @if($value->field->type === 'file')
                            @if($value->value)
                                <em>File uploaded: {{ $value->value }}</em>
                            @else
                                <em>No file uploaded</em>
                            @endif
                        @elseif($value->field->type === 'checkbox')
                            {{ $value->value == '1' ? 'Yes' : 'No' }}
                        @else
                            {{ $value->value ?? 'N/A' }}
                        @endif
                    </td>
                </tr>
            @endif
        @endforeach
    </tbody>
</table>

@if($submission->ip_address)
    <div style="margin-top: 20px; font-size: 10px; color: #666;">
        <strong>Technical Information:</strong><br>
        IP Address: {{ $submission->ip_address }}<br>
        User Agent: {{ $submission->user_agent }}
    </div>
@endif

<div class="footer">
    <div>Page 1 of 1</div>
    @if($show_branding)
        <div>Generated using Sangathan.space</div>
    @endif
</div>
@endsection