<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\OrganisationPaymentProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OrganisationPaymentProfileController extends Controller
{
    /**
     * Show the form for editing payment profile settings.
     */
    public function edit(Organisation $organisation)
    {
        $this->authorize('update', $organisation);

        $profile = OrganisationPaymentProfile::firstOrCreate(
            ['organisation_id' => $organisation->id],
            [
                'upi_id' => null,
                'bank_account_number' => null,
                'bank_ifsc' => null,
                'bank_account_holder' => null,
                'bank_name' => null,
                'other_payment_methods' => null,
                'payment_instructions' => null,
            ]
        );

        return view('payments.settings', [
            'organisation' => $organisation,
            'profile' => $profile,
        ]);
    }

    /**
     * Update the payment profile settings.
     */
    public function update(Request $request, Organisation $organisation)
    {
        $this->authorize('update', $organisation);

        $profile = OrganisationPaymentProfile::firstOrCreate(
            ['organisation_id' => $organisation->id]
        );

        $validated = $request->validate([
            'upi_id' => ['nullable', 'string', 'max:100'],
            'upi_qr_code' => ['nullable', 'image', 'max:2048'],
            'bank_account_number' => ['nullable', 'string', 'max:50'],
            'bank_ifsc' => ['nullable', 'string', 'max:20', 'regex:/^[A-Z]{4}0[A-Z0-9]{6}$/'],
            'bank_account_holder' => ['nullable', 'string', 'max:100'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'other_payment_methods' => ['nullable', 'string', 'max:1000'],
            'payment_instructions' => ['nullable', 'string', 'max:1000'],
            'remove_upi_qr_code' => ['nullable', 'boolean'],
        ]);

        // Handle UPI QR code upload
        if ($request->hasFile('upi_qr_code')) {
            // Delete old QR code if exists
            if ($profile->upi_qr_code) {
                Storage::delete($profile->upi_qr_code);
            }

            $file = $request->file('upi_qr_code');
            $filename = 'upi_qr_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('payment_profiles/' . $organisation->id, $filename, 'public');
            $validated['upi_qr_code'] = $path;
        }

        // Handle QR code removal
        if ($request->boolean('remove_upi_qr_code') && $profile->upi_qr_code) {
            Storage::delete($profile->upi_qr_code);
            $validated['upi_qr_code'] = null;
        }

        // Validate UPI ID format if provided
        if (!empty($validated['upi_id'])) {
            $upiPattern = '/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/';
            if (!preg_match($upiPattern, $validated['upi_id'])) {
                return back()->withErrors(['upi_id' => 'Invalid UPI ID format. Use format like username@bank or mobilenumber@upi'])->withInput();
            }
        }

        $profile->update($validated);

        return redirect()->route('organisations.dashboard', $organisation)
            ->with('success', 'Payment settings updated successfully.');
    }
}