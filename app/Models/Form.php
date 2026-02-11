<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Form extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'organisation_id',
        'title',
        'description',
        'is_public',
        'is_active',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'is_public' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the organisation that owns the form.
     */
    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class);
    }

    /**
     * Get the user who created the form.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the fields for the form.
     */
    public function fields(): HasMany
    {
        return $this->hasMany(FormField::class)->orderBy('position');
    }

    /**
     * Get the submissions for the form.
     */
    public function submissions(): HasMany
    {
        return $this->hasMany(FormSubmission::class)->orderBy('submitted_at', 'desc');
    }

    /**
     * Scope to filter forms by organisation.
     */
    public function scopeForOrganisation($query, $organisationId)
    {
        return $query->where('organisation_id', $organisationId);
    }

    /**
     * Scope to filter active forms.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter public forms.
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true)->where('is_active', true);
    }

    /**
     * Get the public URL for the form.
     */
    public function getPublicUrlAttribute(): string
    {
        return route('public.forms.show', [
            'organisation' => $this->organisation->slug,
            'form' => $this->id,
        ]);
    }

    /**
     * Get the number of submissions.
     */
    public function getSubmissionCountAttribute(): int
    {
        return $this->submissions()->count();
    }

    /**
     * Check if form has any submissions.
     */
    public function getHasSubmissionsAttribute(): bool
    {
        return $this->submissions()->exists();
    }
}