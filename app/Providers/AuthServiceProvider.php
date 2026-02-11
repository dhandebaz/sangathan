<?php

namespace App\Providers;

use App\Models\Donation;
use App\Models\Form;
use App\Models\FormSubmission;
use App\Models\Member;
use App\Models\Meeting;
use App\Policies\DonationPolicy;
use App\Policies\FormPolicy;
use App\Policies\FormSubmissionPolicy;
use App\Policies\MemberPolicy;
use App\Policies\MeetingPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Member::class => MemberPolicy::class,
        Meeting::class => MeetingPolicy::class,
        Form::class => FormPolicy::class,
        FormSubmission::class => FormSubmissionPolicy::class,
        Donation::class => DonationPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}