<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'organisation_id',
        'donor_name',
        'amount',
        'payment_mode',
        'reference_number',
        'notes',
        'donation_date',
        'source',
        'claim_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'donation_date' => 'date',
    ];

    /**
     * Get the organisation that owns the donation.
     */
    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class);
    }

    /**
     * Get the payment claim that created this donation.
     */
    public function paymentClaim(): BelongsTo
    {
        return $this->belongsTo(PaymentClaim::class, 'claim_id');
    }

    /**
     * Scope to filter donations by organisation.
     */
    public function scopeForOrganisation($query, $organisationId)
    {
        return $query->where('organisation_id', $organisationId);
    }

    /**
     * Scope to filter donations by source.
     */
    public function scopeBySource($query, $source)
    {
        return $query->where('source', $source);
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

    /**
     * Get source display text.
     */
    public function getSourceDisplayAttribute(): string
    {
        return match ($this->source) {
            'manual' => 'Manual Entry',
            'payment_claim' => 'Payment Claim',
            default => ucfirst($this->source),
        };
    }
}