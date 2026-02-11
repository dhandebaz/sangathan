<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Organisation;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterController extends Controller
{
    /**
     * Show the registration form.
     */
    public function showRegistrationForm()
    {
        return view('auth.register', [
            'organisationTypes' => Organisation::TYPES,
        ]);
    }

    /**
     * Handle a registration request.
     */
    public function register(Request $request)
    {
        $this->validator($request);

        DB::beginTransaction();
        
        try {
            // Create the user
            $user = $this->createUser($request);
            
            // Create the organisation
            $organisation = $this->createOrganisation($request);
            
            // Attach user to organisation with admin role
            $this->attachUserToOrganisation($user, $organisation);
            
            DB::commit();
            
            event(new Registered($user));
            
            Auth::login($user);
            
            return redirect($this->redirectPath());
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Validate the registration request.
     */
    protected function validator(Request $request)
    {
        return $request->validate([
            // User fields
            'user_name' => ['required', 'string', 'max:255'],
            'user_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'user_password' => ['required', 'confirmed', Password::defaults()],
            'user_phone' => ['nullable', 'string', 'max:20'],
            'user_designation' => ['nullable', 'string', 'max:255'],
            
            // Organisation fields
            'organisation_name' => ['required', 'string', 'max:255'],
            'organisation_type' => ['required', Rule::in(array_keys(Organisation::TYPES))],
            'organisation_description' => ['nullable', 'string', 'max:1000'],
            'organisation_email' => ['nullable', 'string', 'email', 'max:255'],
            'organisation_phone' => ['nullable', 'string', 'max:20'],
            'organisation_address' => ['nullable', 'string', 'max:500'],
            'organisation_city' => ['nullable', 'string', 'max:100'],
            'organisation_state' => ['nullable', 'string', 'max:100'],
            'organisation_country' => ['nullable', 'string', 'max:100', 'default' => 'India'],
            'organisation_postal_code' => ['nullable', 'string', 'max:20'],
            'organisation_website' => ['nullable', 'url', 'max:255'],
            'organisation_registration_number' => ['nullable', 'string', 'max:100'],
            'organisation_registration_date' => ['nullable', 'date'],
        ]);
    }

    /**
     * Create a new user instance.
     */
    protected function createUser(Request $request)
    {
        return User::create([
            'name' => $request->user_name,
            'email' => $request->user_email,
            'password' => Hash::make($request->user_password),
            'phone' => $request->user_phone,
            'designation' => $request->user_designation,
            'is_active' => true,
        ]);
    }

    /**
     * Create a new organisation instance.
     */
    protected function createOrganisation(Request $request)
    {
        return Organisation::create([
            'name' => $request->organisation_name,
            'type' => $request->organisation_type,
            'slug' => Organisation::generateUniqueSlug($request->organisation_name),
            'description' => $request->organisation_description,
            'email' => $request->organisation_email,
            'phone' => $request->organisation_phone,
            'address' => $request->organisation_address,
            'city' => $request->organisation_city,
            'state' => $request->organisation_state,
            'country' => $request->organisation_country ?? 'India',
            'postal_code' => $request->organisation_postal_code,
            'website' => $request->organisation_website,
            'registration_number' => $request->organisation_registration_number,
            'registration_date' => $request->organisation_registration_date,
            'is_active' => true,
        ]);
    }

    /**
     * Attach user to organisation with admin role.
     */
    protected function attachUserToOrganisation(User $user, Organisation $organisation)
    {
        $adminRole = Role::where('name', 'admin')->firstOrFail();
        
        $user->organisations()->attach($organisation->id, [
            'role_id' => $adminRole->id,
            'is_primary' => true,
        ]);
    }

    /**
     * Get the post register redirect path.
     */
    public function redirectPath()
    {
        return '/dashboard';
    }
}