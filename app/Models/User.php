<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'designation',
        'is_active',
        'is_system_admin',
        'is_disabled',
        'last_login_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_system_admin' => 'boolean',
            'is_disabled' => 'boolean',
            'last_login_at' => 'datetime',
        ];
    }

    /**
     * Get the organisations for the user.
     */
    public function organisations()
    {
        return $this->belongsToMany(Organisation::class)
                    ->withPivot('role_id', 'is_primary')
                    ->withTimestamps();
    }

    /**
     * Get the primary organisation for the user.
     */
    public function primaryOrganisation()
    {
        return $this->belongsToMany(Organisation::class)
                    ->wherePivot('is_primary', true)
                    ->withPivot('role_id')
                    ->first();
    }

    /**
     * Get the role for a specific organisation.
     */
    public function getRoleForOrganisation($organisationId)
    {
        $pivot = $this->organisations()
                     ->where('organisation_id', $organisationId)
                     ->first();
        
        return $pivot ? $pivot->pivot->role : null;
    }

    /**
     * Check if user has a specific role in an organisation.
     */
    public function hasRoleInOrganisation($organisationId, $roleName)
    {
        $role = $this->getRoleForOrganisation($organisationId);
        return $role && $role->name === $roleName;
    }

    /**
     * Check if user is admin in any organisation.
     */
    public function isAdminInAnyOrganisation()
    {
        return $this->organisations()
                    ->whereHas('roles', function ($query) {
                        $query->where('name', 'admin');
                    })
                    ->exists();
    }
}