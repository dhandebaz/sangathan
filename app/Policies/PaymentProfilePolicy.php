<?php

namespace App\Policies;

use App\Models\OrganisationPaymentProfile;
use App\Models\PaymentClaim;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaymentProfilePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the payment profile.
     */
    public function view(User $user, OrganisationPaymentProfile $profile): bool
    {
        // User can view payment profile in their organisation
        return $user->organisations()
                   ->where('organisation_id', $profile->organisation_id)
                   ->exists();
    }

    /**
     * Determine whether the user can update the payment profile.
     */
    public function update(User $user, OrganisationPaymentProfile $profile): bool
    {
        // Only Admin can update payment profile
        $organisationId = session('current_organisation_id');
        
        // Ensure profile belongs to user's current organisation
        if ($profile->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin');
    }
}