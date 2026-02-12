<?php

namespace App\Http\Controllers;

use App\Models\Organisation;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleRazorpay(Request $request)
    {
        $webhookSecret = config('services.razorpay.webhook_secret');
        $signature = $request->header('X-Razorpay-Signature');
        $payload = $request->getContent();

        // Validate Signature
        try {
            $api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
            $api->utility->verifyWebhookSignature($payload, $signature, $webhookSecret);
        } catch (\Exception $e) {
            Log::error('Razorpay Webhook Signature Verification Failed: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Invalid Signature'], 400);
        }

        $data = json_decode($payload, true);
        $event = $data['event'] ?? null;
        
        Log::info('Razorpay Webhook Received: ' . $event, ['payload' => $data]);

        if (!$event) {
            return response()->json(['status' => 'ignored'], 200);
        }

        switch ($event) {
            case 'subscription.activated':
                $this->handleSubscriptionActivated($data);
                break;

            case 'subscription.cancelled':
                $this->handleSubscriptionCancelled($data);
                break;
                
            case 'subscription.charged':
                 // Optional: Extend expiry if we were tracking strict dates, but prompt says "is_supporter = true"
                 // We might want to ensure it stays true.
                 $this->handleSubscriptionCharged($data);
                 break;

            case 'payment.failed':
                $this->handlePaymentFailed($data);
                break;
        }

        return response()->json(['status' => 'success'], 200);
    }

    protected function handleSubscriptionActivated(array $data)
    {
        $subscriptionId = $data['payload']['subscription']['entity']['id'];
        $notes = $data['payload']['subscription']['entity']['notes'] ?? [];
        $organisationId = $notes['organisation_id'] ?? null;

        if (!$organisationId) {
            // Try to find by subscription ID if we already stored it (e.g. at creation time)
            $organisation = Organisation::where('razorpay_subscription_id', $subscriptionId)->first();
        } else {
            $organisation = Organisation::find($organisationId);
        }

        if ($organisation) {
            $organisation->update([
                'is_supporter' => true,
                'supporter_since' => now(),
                'razorpay_subscription_id' => $subscriptionId, // Ensure it's set
                'razorpay_customer_id' => $data['payload']['subscription']['entity']['customer_id'] ?? $organisation->razorpay_customer_id,
            ]);

            AuditLog::log('supporter_subscription_activated', $organisation, [
                'subscription_id' => $subscriptionId,
                'event' => 'subscription.activated'
            ]);
        } else {
            Log::error('Razorpay Webhook: Organisation not found for subscription ' . $subscriptionId);
        }
    }

    protected function handleSubscriptionCancelled(array $data)
    {
        $subscriptionId = $data['payload']['subscription']['entity']['id'];
        $organisation = Organisation::where('razorpay_subscription_id', $subscriptionId)->first();

        if ($organisation) {
            // Prompt Option: "Immediately set false"
            $organisation->update([
                'is_supporter' => false,
                // We keep supporter_since for history or clear it? 
                // Usually better to keep it or maybe have a 'supporter_until'.
                // For simple bool logic, just setting false is enough.
            ]);

            AuditLog::log('supporter_subscription_cancelled', $organisation, [
                'subscription_id' => $subscriptionId,
                'event' => 'subscription.cancelled'
            ]);
        }
    }
    
    protected function handleSubscriptionCharged(array $data)
    {
        $subscriptionId = $data['payload']['subscription']['entity']['id'];
        $organisation = Organisation::where('razorpay_subscription_id', $subscriptionId)->first();
        
        if ($organisation && !$organisation->is_supporter) {
            // Reactivate if it was somehow disabled but paid
            $organisation->update(['is_supporter' => true]);
        }
    }

    protected function handlePaymentFailed(array $data)
    {
        // Log it, maybe notify admin (optional)
        Log::warning('Razorpay Payment Failed', ['data' => $data]);
    }
}
