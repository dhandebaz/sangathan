<?php

namespace App\Policies;

use App\Models\Donation;
use App\Models\User;
use App\Models\Organisation;

class DonationPolicy
{
    /**
     * Determine whether the user can view any donations.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasOrganisationContext();
    }

    /**
     * Determine whether the user can view the donation.
     */
    public function view(User $user, Donation $donation): bool
    {
        return $user->hasOrganisationContext() && 
               $user->organisations()->where('organisation_id', $donation->organisation_id)->exists();
    }

    /**
     * Determine whether the user can create donations.
     */
    public function create(User $user): bool
    {
        return $user->hasOrganisationContext() && 
               in_array($user->currentOrganisationRole(), ['admin', 'editor']);
    }

    /**
     * Determine whether the user can update the donation.
     */
    public function update(User $user, Donation $donation): bool
    {
        return $user->hasOrganisationContext() && 
               $user->organisations()->where('organisation_id', $donation->organisation_id)->exists() &&
               in_array($user->currentOrganisationRole(), ['admin', 'editor']);
    }

    /**
     * Determine whether the user can delete the donation.
     */
    public function delete(User $user, Donation $donation): bool
    {
        return $user->hasOrganisationContext() && 
               $user->organisations()->where('organisation_id', $donation->organisation_id)->exists() &&
               $user->currentOrganisationRole() === 'admin';
    }
}