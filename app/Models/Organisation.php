<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organisation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'type',
        'slug',
        'description',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'website',
        'registration_number',
        'registration_date',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'registration_date' => 'date',
        'is_active' => 'boolean',
    ];

    /**
     * Organisation types (strict enum).
     */
    const TYPES = [
        'ngo_trust' => 'NGO / Trust',
        'section8_company' => 'Section 8 Company',
        'registered_society' => 'Registered Society',
        'student_union' => 'Student Union / Student Group',
        'worker_union' => 'Worker Union / Association',
        'community_committee' => 'Community / Mohalla Committee',
        'political_advocacy' => 'Political / Advocacy Group',
        'collective_movement' => 'Collective / Movement',
    ];

    /**
     * Get the users for the organisation.
     */
    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->withPivot('role_id', 'is_primary')
                    ->withTimestamps();
    }

    /**
     * Get the admin users for the organisation.
     */
    public function admins()
    {
        return $this->belongsToMany(User::class)
                    ->wherePivot('role_id', function ($query) {
                        $query->select('id')->from('roles')->where('name', 'admin');
                    })
                    ->withPivot('is_primary')
                    ->withTimestamps();
    }

    /**
     * Get the primary user for the organisation.
     */
    public function primaryUser()
    {
        return $this->belongsToMany(User::class)
                    ->wherePivot('is_primary', true)
                    ->withPivot('role_id')
                    ->first();
    }

    /**
     * Get the display name for the organisation type.
     */
    public function getTypeDisplayNameAttribute()
    {
        return self::TYPES[$this->type] ?? $this->type;
    }

    /**
     * Generate a unique slug.
     */
    public static function generateUniqueSlug($name)
    {
        $slug = \Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;

        while (static::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }
}