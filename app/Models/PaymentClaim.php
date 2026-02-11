<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentClaim extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'organisation_id',
        'payer_name',
        'amount',
        'payment_mode',
        'upi_reference_id',
        'screenshot',
        'notes',
        'status',
        'verified_at',
        'verified_by',
        'submitter_ip',
        'submitter_user_agent',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'verified_at' => 'datetime',
    ];

    /**
     * Get the organisation that owns the payment claim.
     */
    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class);
    }

    /**
     * Get the user who verified the payment claim.
     */
    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Scope to filter claims by organisation.
     */
    public function scopeForOrganisation($query, $organisationId)
    {
        return $query->where('organisation_id', $organisationId);
    }

    /**
     * Scope to filter claims by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Check if claim can be converted to donation.
     */
    public function canConvertToDonation(): bool
    {
        return $this->status === 'verified';
    }

    /**
     * Convert claim to donation data.
     */
    public function toDonationData(): array
    {
        return [
            'organisation_id' => $this->organisation_id,
            'donor_name' => $this->payer_name,
            'amount' => $this->amount,
            'payment_mode' => $this->payment_mode,
            'reference_number' => $this->upi_reference_id,
            'notes' => "Payment claim #{$this->id} verified by {$this->verifier->name}",
            'donation_date' => $this->verified_at->format('Y-m-d'),
            'source' => 'payment_claim',
            'claim_id' => $this->id,
        ];
    }

    /**
     * Mark claim as verified.
     */
    public function markAsVerified(User $verifier): void
    {
        $this->update([
            'status' => 'verified',
            'verified_at' => now(),
            'verified_by' => $verifier->id,
        ]);
    }

    /**
     * Mark claim as rejected.
     */
    public function markAsRejected(User $verifier): void
    {
        $this->update([
            'status' => 'rejected',
            'verified_at' => now(),
            'verified_by' => $verifier->id,
        ]);
    }

    /**
     * Get status badge class.
     */
    public function getStatusBadgeClassAttribute(): string
    {
        return match ($this->status) {
            'verified' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-yellow-100 text-yellow-800',
        };
    }

    /**
     * Get status display text.
     */
    public function getStatusDisplayAttribute(): string
    {
        return ucfirst($this->status);
    }

    /**
     * Get payment mode display text.
     */
    public function getPaymentModeDisplayAttribute(): string
    {
        return match ($this->payment_mode) {
            'upi' => 'UPI',
            'bank' => 'Bank Transfer',
            'cash' => 'Cash',
            default => ucfirst($this->payment_mode),
        };
    }
}