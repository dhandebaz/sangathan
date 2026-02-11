@extends('pdf.layout')

@section('title', 'Form Submissions Summary - ' . $form->title)

@section('content')
<div class="header">
    <div class="organisation-name">{{ $organisation->name }}</div>
    <div class="organisation-type">{{ $organisation->type_display_name }}</div>
</div>

<div class="document-title">Form Submissions Summary</div>
<div class="document-info">
    <div>Form: {{ $form->title }}</div>
    <div>Total Submissions: {{ $submissions->count() }}</div>
    <div>Date Range: {{ $date_range }}</div>
    <div>Generated on: {{ $generated_date }}</div>
</div>

@if($submissions->isEmpty())
    <p>No submissions found for the selected criteria.</p>
@else
    <table>
        <thead>
            <tr>
                <th width="8%">S. No.</th>
                <th width="15%">Submitted Date</th>
                @foreach($keyFields as $field)
                    <th>{{ $field->label }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($submissions as $index => $submission)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>{{ $submission->created_at->format('d/m/Y H:i') }}</td>
                    @foreach($keyFields as $field)
                        <td>
                            @php
                                $value = $submission->values->where('form_field_id', $field->id)->first();
                                echo $value ? $value->value : 'N/A';
                            @endphp
                        </td>
                    @endforeach
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