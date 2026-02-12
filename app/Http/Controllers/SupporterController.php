<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;

class SupporterController extends Controller
{
    /**
     * Show the supporter settings / status page.
     */
    public function index()
    {
        $organisation = Organisation::findOrFail(session('current_organisation_id'));
        return view('supporter.index', compact('organisation'));
    }

    /**
     * Initiate the subscription process.
     */
    public function subscribe(Request $request)
    {
        $organisation = Organisation::findOrFail(session('current_organisation_id'));
        
        if ($organisation->is_supporter) {
            return back()->with('message', 'You are already a supporter!');
        }

        $keyId = config('services.razorpay.key');
        $keySecret = config('services.razorpay.secret');
        
        if (!$keyId || !$keySecret) {
            return back()->with('error', 'Payment gateway not configured.');
        }

        $api = new Api($keyId, $keySecret);

        // 1. Create or Get Customer
        if (!$organisation->razorpay_customer_id) {
            try {
                $customer = $api->customer->create([
                    'name' => $organisation->name,
                    'email' => $organisation->email ?? 'admin@' . $organisation->slug . '.com',
                    'contact' => $organisation->phone ?? '',
                    'notes' => [
                        'organisation_id' => $organisation->id,
                        'slug' => $organisation->slug
                    ]
                ]);
                
                $organisation->update(['razorpay_customer_id' => $customer->id]);
            } catch (\Exception $e) {
                Log::error('Razorpay Customer Creation Failed: ' . $e->getMessage());
                return back()->with('error', 'Failed to initialize payment. Please try again.');
            }
        }

        // 2. Create Subscription
        // Note: Plan ID must be created in Razorpay Dashboard and set in .env
        $planId = config('services.razorpay.supporter_plan_id'); 
        
        if (!$planId) {
             // Fallback or Error? 
             // Ideally we should create a plan on the fly if strictly needed, 
             // but best practice is using a fixed Plan ID.
             // I will log error and ask user to config.
             return back()->with('error', 'Subscription plan not configured in system.');
        }

        try {
            $subscription = $api->subscription->create([
                'plan_id' => $planId,
                'customer_id' => $organisation->razorpay_customer_id,
                'total_count' => 120, // 10 years (indefinite effectively)
                'quantity' => 1,
                'notes' => [
                    'organisation_id' => $organisation->id,
                    'domain' => request()->getHost()
                ]
            ]);

            // Store subscription ID early for tracking
            $organisation->update(['razorpay_subscription_id' => $subscription->id]);

        } catch (\Exception $e) {
            Log::error('Razorpay Subscription Creation Failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to create subscription. ' . $e->getMessage());
        }

        return view('supporter.checkout', [
            'organisation' => $organisation,
            'subscription_id' => $subscription->id,
            'key_id' => $keyId,
            'amount' => 9900, // ₹99.00
            'name' => 'Sangathan Supporter',
            'description' => 'Monthly subscription'
        ]);
    }

    /**
     * Update supporter settings (Branding Toggle).
     */
    public function updateSettings(Request $request)
    {
        $organisation = Organisation::findOrFail(session('current_organisation_id'));
        
        if (!$organisation->is_supporter) {
            abort(403, 'Supporter access required.');
        }

        $validated = $request->validate([
            'branding_disabled' => 'required|boolean',
        ]);

        $organisation->update([
            'branding_disabled' => $validated['branding_disabled']
        ]);

        AuditLog::log('supporter_settings_updated', $organisation, $validated);

        return back()->with('success', 'Settings updated successfully.');
    }
}
