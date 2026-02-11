<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\OrganisationPaymentProfile;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display the public payment page for an organisation.
     */
    public function publicPage(Organisation $organisation)
    {
        // Get or create payment profile
        $paymentProfile = OrganisationPaymentProfile::firstOrCreate(
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

        return view('payments.public.page', [
            'organisation' => $organisation,
            'paymentProfile' => $paymentProfile,
        ]);
    }
}