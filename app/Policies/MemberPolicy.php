<?php

namespace App\Policies;

use App\Models\Member;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MemberPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any members.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view members in their organisation
        return true;
    }

    /**
     * Determine whether the user can view the member.
     */
    public function view(User $user, Member $member): bool
    {
        // User can view members in their organisation
        return $user->organisations()
                   ->where('organisation_id', $member->organisation_id)
                   ->exists();
    }

    /**
     * Determine whether the user can create members.
     */
    public function create(User $user): bool
    {
        // Admin and Editor can create members
        $organisationId = session('current_organisation_id');
        return $user->hasRoleInOrganisation($organisationId, 'admin') || 
               $user->hasRoleInOrganisation($organisationId, 'editor');
    }

    /**
     * Determine whether the user can update the member.
     */
    public function update(User $user, Member $member): bool
    {
        // Admin and Editor can update members
        $organisationId = session('current_organisation_id');
        
        // Ensure member belongs to user's current organisation
        if ($member->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin') || 
               $user->hasRoleInOrganisation($organisationId, 'editor');
    }

    /**
     * Determine whether the user can delete the member.
     */
    public function delete(User $user, Member $member): bool
    {
        // Only Admin can delete members
        $organisationId = session('current_organisation_id');
        
        // Ensure member belongs to user's current organisation
        if ($member->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin');
    }

    /**
     * Determine whether the user can toggle member status.
     */
    public function toggleStatus(User $user, Member $member): bool
    {
        // Admin and Editor can toggle status
        $organisationId = session('current_organisation_id');
        
        // Ensure member belongs to user's current organisation
        if ($member->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin') || 
               $user->hasRoleInOrganisation($organisationId, 'editor');
    }
}