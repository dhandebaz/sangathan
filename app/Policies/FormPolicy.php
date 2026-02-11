<?php

namespace App\Policies;

use App\Models\Form;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FormPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any forms.
     */
    public function viewAny(User $user): bool
    {
        // All authenticated users can view forms in their organisation
        return true;
    }

    /**
     * Determine whether the user can view the form.
     */
    public function view(User $user, Form $form): bool
    {
        // User can view forms in their organisation
        return $user->organisations()
                   ->where('organisation_id', $form->organisation_id)
                   ->exists();
    }

    /**
     * Determine whether the user can create forms.
     */
    public function create(User $user): bool
    {
        // Admin and Editor can create forms
        $organisationId = session('current_organisation_id');
        return $user->hasRoleInOrganisation($organisationId, 'admin') || 
               $user->hasRoleInOrganisation($organisationId, 'editor');
    }

    /**
     * Determine whether the user can update the form.
     */
    public function update(User $user, Form $form): bool
    {
        // Admin and Editor can update forms
        $organisationId = session('current_organisation_id');
        
        // Ensure form belongs to user's current organisation
        if ($form->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin') || 
               $user->hasRoleInOrganisation($organisationId, 'editor');
    }

    /**
     * Determine whether the user can delete the form.
     */
    public function delete(User $user, Form $form): bool
    {
        // Only Admin can delete forms
        $organisationId = session('current_organisation_id');
        
        // Ensure form belongs to user's current organisation
        if ($form->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin');
    }
}