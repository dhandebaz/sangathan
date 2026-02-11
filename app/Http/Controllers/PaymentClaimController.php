<?php

namespace App\Http\Controllers;

use App\Models\PaymentClaim;
use App\Models\Organisation;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PaymentClaimController extends Controller
{
    /**
     * Display a listing of payment claims.
     */
    public function index()
    {
        $organisationId = session('current_organisation_id');
        
        $claims = PaymentClaim::forOrganisation($organisationId)
                             ->with(['organisation', 'verifier'])
                             ->orderBy('created_at', 'desc')
                             ->paginate(20);
        
        return view('payments.claims.index', compact('claims'));
    }

    /**
     * Show the form for creating a new payment claim.
     */
    public function create()
    {
        $organisationId = session('current_organisation_id');
        $organisation = Organisation::findOrFail($organisationId);
        
        $profile = $organisation->paymentProfile;
        
        if (!$profile || (!$profile->hasUpiDetails() && !$profile->hasBankDetails())) {
            return redirect()->route('payments.instructions')
                           ->with('error', 'Payment instructions not configured. Please contact the organisation.');
        }
        
        return view('payments.claims.create', compact('organisation', 'profile'));
    }

    /**
     * Store a newly created payment claim.
     */
    public function store(Request $request, Organisation $organisation)
    {
        // Rate limiting - max 3 claims per hour per IP per organisation
        $rateLimitKey = 'payment-claim-' . $organisation->id . '-' . $request->ip();
        if (RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
            $availableIn = RateLimiter::availableIn($rateLimitKey);
            return back()->with('error', 'Too many payment claims. Please try again in ' . ceil($availableIn / 60) . ' minutes.')
                        ->withInput();
        }

        $validator = Validator::make($request->all(), [
            'payer_name' => 'required|string|max:255',
            'payer_email' => 'required|email|max:255',
            'payer_phone' => 'required|string|max:20',
            'amount' => 'required|numeric|min:1|max:1000000',
            'payment_method' => 'required|string|max:50',
            'transaction_reference' => 'required|string|max:100',
            'payment_proof' => 'required|image|max:2048', // 2MB max
            'notes' => 'nullable|string|max:1000',
            'disclaimer_accepted' => 'required|accepted',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Handle payment proof upload
        $proofPath = null;
        if ($request->hasFile('payment_proof')) {
            $image = $request->file('payment_proof');
            $filename = 'payment-proof-' . Str::slug($request->payer_name) . '-' . time() . '.' . $image->getClientOriginalExtension();
            $proofPath = $image->storeAs('payment-proofs', $filename, 'public');
        }

        // Create payment claim
        $claim = PaymentClaim::create([
            'organisation_id' => $organisation->id,
            'payer_name' => $request->payer_name,
            'payer_email' => $request->payer_email,
            'payer_phone' => $request->payer_phone,
            'amount' => $request->amount,
            'payment_method' => $request->payment_method,
            'transaction_reference' => $request->transaction_reference,
            'payment_proof' => $proofPath,
            'notes' => $request->notes,
            'status' => 'pending',
            'submitter_ip' => $request->ip(),
            'submitter_user_agent' => substr($request->userAgent() ?? '', 0, 500),
        ]);

        // Increment rate limit counter
        RateLimiter::hit($rateLimitKey, 3600); // 1 hour window

        return redirect()->route('payments.claims.success', ['organisation' => $organisation])
                        ->with('success', 'Payment claim submitted successfully. Your claim will be reviewed by the organisation.');
    }

    /**
     * Display the specified payment claim.
     */
    public function show(PaymentClaim $claim)
    {
        $this->authorize('view', $claim);
        
        $claim->load(['organisation', 'verifier']);
        
        return view('payments.claims.show', compact('claim'));
    }

    /**
     * Show success page after claim submission.
     */
    public function success(PaymentClaim $claim)
    {
        return view('payments.claims.success', compact('claim'));
    }

    /**
     * Verify a payment claim.
     */
    public function verify(Request $request, PaymentClaim $claim)
    {
        $this->authorize('update', $claim);

        if ($claim->status !== 'pending') {
            return back()->with('error', 'This claim has already been processed.');
        }

        $claim->markAsVerified(auth()->user());

        // Convert to donation
        $donation = Donation::create($claim->toDonationData());

        return back()->with('success', 'Payment claim verified and converted to donation record.');
    }

    /**
     * Reject a payment claim.
     */
    public function reject(Request $request, PaymentClaim $claim)
    {
        $this->authorize('update', $claim);

        if ($claim->status !== 'pending') {
            return back()->with('error', 'This claim has already been processed.');
        }

        $claim->markAsRejected(auth()->user());

        return back()->with('success', 'Payment claim rejected.');
    }

    /**
     * Display payment instructions.
     */
    public function instructions()
    {
        $organisationId = session('current_organisation_id');
        $organisation = Organisation::findOrFail($organisationId);
        
        $profile = $organisation->paymentProfile;
        
        return view('payments.instructions', compact('organisation', 'profile'));
    }

    /**
     * Display public payment page.
     */
    public function publicPage($organisationSlug)
    {
        $organisation = Organisation::where('slug', $organisationSlug)->firstOrFail();
        $profile = $organisation->paymentProfile;
        
        if (!$profile || (!$profile->hasUpiDetails() && !$profile->hasBankDetails())) {
            abort(404, 'Payment instructions not available.');
        }
        
        return view('payments.public.page', compact('organisation', 'profile'));
    }
}