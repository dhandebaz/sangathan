<?php

namespace App\Http\Controllers;

use App\Models\OrganisationPaymentProfile;
use App\Models\Organisation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PaymentProfileController extends Controller
{
    /**
     * Display the payment profile settings.
     */
    public function index()
    {
        $organisationId = session('current_organisation_id');
        $organisation = Organisation::findOrFail($organisationId);
        
        $profile = OrganisationPaymentProfile::where('organisation_id', $organisationId)->first();
        
        return view('payments.profile.index', compact('organisation', 'profile'));
    }

    /**
     * Store or update the payment profile.
     */
    public function store(Request $request)
    {
        $organisationId = session('current_organisation_id');
        
        // Validate the request
        $validator = Validator::make($request->all(), [
            'account_holder_name' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:50',
            'ifsc_code' => 'nullable|string|max:20',
            'branch' => 'nullable|string|max:255',
            'upi_id' => 'nullable|string|max:255',
            'upi_qr_image' => 'nullable|image|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Validate UPI ID format if provided
        if ($request->filled('upi_id') && !$this->validateUpiId($request->upi_id)) {
            return back()->withErrors(['upi_id' => 'Invalid UPI ID format. Use: username@bank'])->withInput();
        }

        // Find or create the profile
        $profile = OrganisationPaymentProfile::firstOrNew([
            'organisation_id' => $organisationId,
        ]);

        // Handle QR code image upload
        $upiQrImagePath = $profile->upi_qr_image;
        if ($request->hasFile('upi_qr_image')) {
            // Delete old image if exists
            if ($profile->upi_qr_image) {
                Storage::disk('public')->delete($profile->upi_qr_image);
            }
            
            // Store new image
            $image = $request->file('upi_qr_image');
            $filename = 'upi-qr-' . Str::slug($request->upi_id ?: 'default') . '-' . time() . '.' . $image->getClientOriginalExtension();
            $upiQrImagePath = $image->storeAs('payment-qr-codes', $filename, 'public');
        }

        // Update profile
        $profile->fill([
            'account_holder_name' => $request->account_holder_name,
            'bank_name' => $request->bank_name,
            'account_number' => $request->account_number,
            'ifsc_code' => $request->ifsc_code,
            'branch' => $request->branch,
            'upi_id' => $request->upi_id,
            'upi_qr_image' => $upiQrImagePath,
        ]);

        $profile->save();

        return redirect()->route('payments.profile.index')
                        ->with('success', 'Payment profile updated successfully.');
    }

    /**
     * Display payment instructions for the organisation.
     */
    public function instructions()
    {
        $organisationId = session('current_organisation_id');
        $organisation = Organisation::findOrFail($organisationId);
        
        $profile = OrganisationPaymentProfile::where('organisation_id', $organisationId)->first();
        
        return view('payments.instructions', compact('organisation', 'profile'));
    }

    /**
     * Validate UPI ID format.
     */
    private function validateUpiId(string $upiId): bool
    {
        // Basic UPI ID validation: username@bank
        return preg_match('/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/', $upiId);
    }
}