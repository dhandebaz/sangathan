<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\Member;
use App\Models\Meeting;
use App\Models\Donation;
use App\Models\Form;
use App\Models\PaymentClaim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use ZipArchive;
use Carbon\Carbon;

class ExportController extends Controller
{
    public function exportOrganisationData()
    {
        $organisationId = session('current_organisation_id');
        $organisation = Organisation::findOrFail($organisationId);
        
        $tempDir = 'temp/export_' . $organisationId . '_' . time();
        Storage::makeDirectory($tempDir);
        
        // 1. Members CSV
        $this->createCsv(
            $tempDir . '/members.csv',
            ['ID', 'Name', 'Phone', 'Role', 'Area', 'Joining Date', 'Status'],
            Member::where('organisation_id', $organisationId)->get()->map(fn($m) => [
                $m->id, $m->full_name, $m->phone_number, $m->role, $m->area_or_district, $m->joining_date, $m->status
            ])
        );

        // 2. Donations CSV
        $this->createCsv(
            $tempDir . '/donations.csv',
            ['ID', 'Donor Name', 'Amount', 'Date', 'Mode', 'Reference', 'Source'],
            Donation::where('organisation_id', $organisationId)->get()->map(fn($d) => [
                $d->id, $d->donor_name, $d->amount, $d->donation_date, $d->payment_mode, $d->reference_number, $d->source
            ])
        );

        // 3. Meetings CSV
        $this->createCsv(
            $tempDir . '/meetings.csv',
            ['ID', 'Title', 'Type', 'Date', 'Time', 'Location', 'Agenda'],
            Meeting::where('organisation_id', $organisationId)->get()->map(fn($m) => [
                $m->id, $m->title, $m->meeting_type, $m->meeting_date, $m->meeting_time, $m->location, $m->agenda
            ])
        );

        // 4. Forms CSV
        $this->createCsv(
            $tempDir . '/forms.csv',
            ['ID', 'Title', 'Description', 'Status', 'Total Submissions'],
            Form::where('organisation_id', $organisationId)->withCount('submissions')->get()->map(fn($f) => [
                $f->id, $f->title, $f->description, $f->is_active ? 'Active' : 'Inactive', $f->submissions_count
            ])
        );

        // 5. Payment Claims CSV
        $this->createCsv(
            $tempDir . '/payment_claims.csv',
            ['ID', 'Payer Name', 'Amount', 'Date', 'Status', 'Transaction Ref'],
            PaymentClaim::where('organisation_id', $organisationId)->get()->map(fn($c) => [
                $c->id, $c->payer_name, $c->amount, $c->created_at, $c->status, $c->transaction_reference
            ])
        );

        // Zip it
        $zipFileName = 'sangathan_export_' . Str::slug($organisation->name) . '_' . date('Y-m-d') . '.zip';
        $zipPath = storage_path('app/' . $tempDir . '/' . $zipFileName);
        
        $zip = new ZipArchive;
        if ($zip->open($zipPath, ZipArchive::CREATE) === TRUE) {
            $files = Storage::files($tempDir);
            foreach ($files as $file) {
                if (basename($file) !== $zipFileName) {
                    $zip->addFile(storage_path('app/' . $file), basename($file));
                }
            }
            $zip->close();
        }

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    private function createCsv($path, $headers, $data)
    {
        $handle = fopen(storage_path('app/' . $path), 'w');
        fputcsv($handle, $headers);
        foreach ($data as $row) {
            fputcsv($handle, $row);
        }
        fclose($handle);
    }
}
