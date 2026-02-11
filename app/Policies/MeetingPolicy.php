<?php

namespace App\Policies;

use App\Models\Meeting;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class MeetingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any meetings.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view meetings in their organisation
        return true;
    }

    /**
     * Determine whether the user can view the meeting.
     */
    public function view(User $user, Meeting $meeting): bool
    {
        // User can view meetings in their organisation
        return $user->organisations()
                   ->where('organisation_id', $meeting->organisation_id)
                   ->exists();
    }

    /**
     * Determine whether the user can create meetings.
     */
    public function create(User $user): bool
    {
        // Admin and Editor can create meetings
        $organisationId = session('current_organisation_id');
        return $user->hasRoleInOrganisation($organisationId, 'admin') || 
               $user->hasRoleInOrganisation($organisationId, 'editor');
    }

    /**
     * Determine whether the user can update the meeting.
     */
    public function update(User $user, Meeting $meeting): bool
    {
        // Admin and Editor can update meetings
        $organisationId = session('current_organisation_id');
        
        // Ensure meeting belongs to user's current organisation
        if ($meeting->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin') || 
               $user->hasRoleInOrganisation($organisationId, 'editor');
    }

    /**
     * Determine whether the user can delete the meeting.
     */
    public function delete(User $user, Meeting $meeting): bool
    {
        // Only Admin can delete meetings
        $organisationId = session('current_organisation_id');
        
        // Ensure meeting belongs to user's current organisation
        if ($meeting->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin');
    }
}