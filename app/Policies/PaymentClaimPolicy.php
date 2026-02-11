<?php

namespace App\Policies;

use App\Models\PaymentClaim;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaymentClaimPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any payment claims.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view claims in their organisation
        return true;
    }

    /**
     * Determine whether the user can view the payment claim.
     */
    public function view(User $user, PaymentClaim $claim): bool
    {
        // User can view claims in their organisation
        return $user->organisations()
                   ->where('organisation_id', $claim->organisation_id)
                   ->exists();
    }

    /**
     * Determine whether the user can create payment claims.
     */
    public function create(User $user): bool
    {
        // All authenticated users can create claims
        return true;
    }

    /**
     * Determine whether the user can update the payment claim.
     */
    public function update(User $user, PaymentClaim $claim): bool
    {
        // Only Admin can verify/reject claims
        $organisationId = session('current_organisation_id');
        
        // Ensure claim belongs to user's current organisation
        if ($claim->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin');
    }

    /**
     * Determine whether the user can delete the payment claim.
     */
    public function delete(User $user, PaymentClaim $claim): bool
    {
        // Only Admin can delete claims
        $organisationId = session('current_organisation_id');
        
        // Ensure claim belongs to user's current organisation
        if ($claim->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin');
    }
}