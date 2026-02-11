<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormSubmissionValue extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'submission_id',
        'field_id',
        'value',
    ];

    /**
     * Get the submission that owns the value.
     */
    public function submission(): BelongsTo
    {
        return $this->belongsTo(FormSubmission::class, 'submission_id');
    }

    /**
     * Get the field that owns the value.
     */
    public function field(): BelongsTo
    {
        return $this->belongsTo(FormField::class, 'field_id');
    }

    /**
     * Get display value for this field value.
     */
    public function getDisplayValueAttribute(): string
    {
        if (!$this->field) {
            return $this->value ?? '';
        }

        // Handle special field types
        if ($this->field->field_type === 'file' && $this->value) {
            return basename($this->value); // Show just filename
        }

        if ($this->field->field_type === 'checkbox' && $this->value) {
            $selectedOptions = json_decode($this->value, true) ?? [];
            return implode(', ', $selectedOptions);
        }

        return $this->value ?? '';
    }
}