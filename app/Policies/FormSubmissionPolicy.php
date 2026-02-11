<?php

namespace App\Policies;

use App\Models\Form;
use App\Models\FormSubmission;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FormSubmissionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any submissions.
     */
    public function viewAny(User $user, Form $form): bool
    {
        // User can view submissions for forms in their organisation
        return $user->organisations()
                   ->where('organisation_id', $form->organisation_id)
                   ->exists();
    }

    /**
     * Determine whether the user can view the submission.
     */
    public function view(User $user, Form $form, FormSubmission $submission): bool
    {
        // User can view submissions for forms in their organisation
        if ($form->organisation_id !== session('current_organisation_id')) {
            return false;
        }
        
        return $user->organisations()
                   ->where('organisation_id', $form->organisation_id)
                   ->exists();
    }

    /**
     * Determine whether the user can convert submission to member.
     */
    public function convertToMember(User $user, Form $form, FormSubmission $submission): bool
    {
        // Only Admin can convert submissions to members
        $organisationId = session('current_organisation_id');
        
        if ($form->organisation_id !== $organisationId) {
            return false;
        }
        
        return $user->hasRoleInOrganisation($organisationId, 'admin');
    }
}