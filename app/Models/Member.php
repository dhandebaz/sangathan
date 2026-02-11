<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Member extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'organisation_id',
        'full_name',
        'phone_number',
        'role',
        'area_or_district',
        'joining_date',
        'status',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'joining_date' => 'date',
        'status' => 'string',
    ];

    /**
     * Get the organisation that owns the member.
     */
    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class);
    }

    /**
     * Scope to filter members by organisation.
     */
    public function scopeForOrganisation($query, $organisationId)
    {
        return $query->where('organisation_id', $organisationId);
    }

    /**
     * Scope to filter active members.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope to filter inactive members.
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Scope to search members by name or phone.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('full_name', 'like', "%{$search}%")
              ->orWhere('phone_number', 'like', "%{$search}%");
        });
    }

    /**
     * Get formatted phone number.
     */
    public function getFormattedPhoneAttribute(): string
    {
        $phone = $this->phone_number;
        
        // Format Indian phone numbers
        if (strlen($phone) === 10) {
            return substr($phone, 0, 3) . '-' . substr($phone, 3, 3) . '-' . substr($phone, 6);
        }
        
        return $phone;
    }

    /**
     * Get status badge class.
     */
    public function getStatusBadgeClassAttribute(): string
    {
        return $this->status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    }

    /**
     * Get status display text.
     */
    public function getStatusDisplayAttribute(): string
    {
        return ucfirst($this->status);
    }
}