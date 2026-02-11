<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganisationPaymentProfile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'organisation_id',
        'account_holder_name',
        'bank_name',
        'account_number',
        'ifsc_code',
        'branch',
        'upi_id',
        'upi_qr_image',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<string>
     */
    protected $hidden = [
        'account_number',
    ];

    /**
     * Get the organisation that owns the payment profile.
     */
    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class);
    }

    /**
     * Check if UPI details are configured.
     */
    public function hasUpiDetails(): bool
    {
        return !empty($this->upi_id);
    }

    /**
     * Check if bank details are configured.
     */
    public function hasBankDetails(): bool
    {
        return !empty($this->account_holder_name) && 
               !empty($this->bank_name) && 
               !empty($this->account_number) && 
               !empty($this->ifsc_code);
    }

    /**
     * Validate UPI ID format.
     */
    public function validateUpiId(): bool
    {
        if (empty($this->upi_id)) {
            return true; // Optional field
        }

        // Basic UPI ID validation: username@bank
        return preg_match('/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/', $this->upi_id);
    }

    /**
     * Generate UPI payment link.
     */
    public function generateUpiLink(float $amount = null, string $note = null): string
    {
        if (!$this->hasUpiDetails()) {
            return '';
        }

        $organisation = $this->organisation;
        $payeeName = urlencode($organisation->name);
        $upiId = urlencode($this->upi_id);
        $transactionNote = urlencode($note ?: 'Payment via Sangathan');
        $amountParam = $amount ? '&am=' . number_format($amount, 2, '.', '') : '';

        return "upi://pay?pa={$upiId}&pn={$payeeName}&tn={$transactionNote}{$amountParam}";
    }

    /**
     * Get formatted bank details for display.
     */
    public function getFormattedBankDetails(): array
    {
        if (!$this->hasBankDetails()) {
            return [];
        }

        return [
            'account_holder_name' => $this->account_holder_name,
            'bank_name' => $this->bank_name,
            'account_number' => '****' . substr($this->account_number, -4),
            'ifsc_code' => $this->ifsc_code,
            'branch' => $this->branch,
        ];
    }

    /**
     * Get display name for payment methods.
     */
    public function getAvailablePaymentMethods(): array
    {
        $methods = [];

        if ($this->hasUpiDetails()) {
            $methods['upi'] = 'UPI (' . $this->upi_id . ')';
        }

        if ($this->hasBankDetails()) {
            $methods['bank'] = 'Bank Transfer (' . $this->bank_name . ')';
        }

        return $methods;
    }
}