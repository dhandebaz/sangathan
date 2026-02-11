<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Organisation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    /**
     * Display a listing of donations.
     */
    public function index(Request $request)
    {
        $organisationId = session('current_organisation_id');
        
        $query = Donation::forOrganisation($organisationId);
        
        // Apply date range filter if provided
        if ($request->filled('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->where('created_at', '<=', $request->end_date . ' 23:59:59');
        }
        
        // Apply search filter if provided
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('donor_name', 'like', "%{$search}%")
                  ->orWhere('donor_email', 'like', "%{$search}%")
                  ->orWhere('donor_phone', 'like', "%{$search}%")
                  ->orWhere('reference_id', 'like', "%{$search}%");
            });
        }
        
        $donations = $query->orderBy('created_at', 'desc')
                          ->paginate(20);
        
        return view('donations.index', compact('donations'));
    }
    
    /**
     * Show the form for creating a new donation.
     */
    public function create()
    {
        $organisationId = session('current_organisation_id');
        $organisation = Organisation::findOrFail($organisationId);
        
        return view('donations.create', compact('organisation'));
    }
    
    /**
     * Store a newly created donation.
     */
    public function store(Request $request)
    {
        $organisationId = session('current_organisation_id');
        
        $validated = $request->validate([
            'donor_name' => 'required|string|max:255',
            'donor_email' => 'nullable|email|max:255',
            'donor_phone' => 'nullable|string|max:20',
            'amount' => 'required|numeric|min:0.01',
            'mode' => 'required|in:cash,cheque,online,bank_transfer,upi,other',
            'reference_id' => 'nullable|string|max:100',
            'purpose' => 'nullable|string|max:255',
            'received_by' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);
        
        $donation = Donation::create(array_merge($validated, [
            'organisation_id' => $organisationId,
            'source' => 'manual',
        ]));
        
        return redirect()->route('donations.index')
                        ->with('success', 'Donation recorded successfully.');
    }
    
    /**
     * Display the specified donation.
     */
    public function show(Donation $donation)
    {
        $this->authorize('view', $donation);
        
        return view('donations.show', compact('donation'));
    }
    
    /**
     * Show the form for editing the specified donation.
     */
    public function edit(Donation $donation)
    {
        $this->authorize('update', $donation);
        
        return view('donations.edit', compact('donation'));
    }
    
    /**
     * Update the specified donation in storage.
     */
    public function update(Request $request, Donation $donation)
    {
        $this->authorize('update', $donation);
        
        $validated = $request->validate([
            'donor_name' => 'required|string|max:255',
            'donor_email' => 'nullable|email|max:255',
            'donor_phone' => 'nullable|string|max:20',
            'amount' => 'required|numeric|min:0.01',
            'mode' => 'required|in:cash,cheque,online,bank_transfer,upi,other',
            'reference_id' => 'nullable|string|max:100',
            'purpose' => 'nullable|string|max:255',
            'received_by' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);
        
        $donation->update($validated);
        
        return redirect()->route('donations.index')
                        ->with('success', 'Donation updated successfully.');
    }
    
    /**
     * Remove the specified donation from storage.
     */
    public function destroy(Donation $donation)
    {
        $this->authorize('delete', $donation);
        
        $donation->delete();
        
        return redirect()->route('donations.index')
                        ->with('success', 'Donation deleted successfully.');
    }
}