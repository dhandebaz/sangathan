<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FormSubmission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'form_id',
        'submitted_at',
        'submitter_ip',
        'submitter_user_agent',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'submitted_at' => 'datetime',
    ];

    /**
     * Get the form that owns the submission.
     */
    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }

    /**
     * Get the submission values.
     */
    public function values(): HasMany
    {
        return $this->hasMany(FormSubmissionValue::class, 'submission_id');
    }

    /**
     * Get a specific field value.
     */
    public function getValueForField($fieldId)
    {
        return $this->values()->where('field_id', $fieldId)->first();
    }

    /**
     * Get all values as an associative array.
     */
    public function getValuesArray(): array
    {
        $values = [];
        foreach ($this->values as $value) {
            $values[$value->field_id] = $value->value;
        }
        return $values;
    }

    /**
     * Get display value for a specific field.
     */
    public function getDisplayValueForField($fieldId)
    {
        $value = $this->getValueForField($fieldId);
        if (!$value) {
            return null;
        }

        $field = $value->field;
        if (!$field) {
            return $value->value;
        }

        // Handle special field types
        if ($field->field_type === 'file' && $value->value) {
            return basename($value->value); // Show just filename
        }

        if ($field->field_type === 'checkbox' && $value->value) {
            $selectedOptions = json_decode($value->value, true) ?? [];
            return implode(', ', $selectedOptions);
        }

        return $value->value;
    }

    /**
     * Check if this submission can be converted to a member.
     */
    public function canConvertToMember(): bool
    {
        // Check if we have the required fields for member creation
        $values = $this->getValuesArray();
        $formFields = $this->form->fields;

        $hasName = false;
        $hasPhone = false;

        foreach ($formFields as $field) {
            if (isset($values[$field->id])) {
                $value = $values[$field->id];
                if ($field->label === 'Full Name' || stripos($field->label, 'name') !== false) {
                    $hasName = !empty($value);
                }
                if ($field->field_type === 'phone' && !empty($value)) {
                    $hasPhone = true;
                }
            }
        }

        return $hasName && $hasPhone;
    }

    /**
     * Convert submission to member data.
     */
    public function toMemberData(): array
    {
        $values = $this->getValuesArray();
        $formFields = $this->form->fields;

        $memberData = [
            'full_name' => '',
            'phone_number' => '',
            'role' => 'Member',
            'area_or_district' => '',
            'notes' => '',
        ];

        foreach ($formFields as $field) {
            if (!isset($values[$field->id])) {
                continue;
            }

            $value = $values[$field->id];

            // Map common form fields to member fields
            if ($field->label === 'Full Name' || stripos($field->label, 'name') !== false) {
                $memberData['full_name'] = $value;
            } elseif ($field->field_type === 'phone') {
                $memberData['phone_number'] = $value;
            } elseif ($field->label === 'Role' || stripos($field->label, 'role') !== false) {
                $memberData['role'] = $value ?: 'Member';
            } elseif ($field->label === 'Area' || stripos($field->label, 'area') !== false) {
                $memberData['area_or_district'] = $value;
            } else {
                // Add other fields to notes
                if (!empty($value)) {
                    $memberData['notes'] .= $field->label . ': ' . $value . "\n";
                }
            }
        }

        // Set default joining date
        $memberData['joining_date'] = now()->format('Y-m-d');

        return $memberData;
    }
}