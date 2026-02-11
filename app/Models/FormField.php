<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FormField extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'form_id',
        'label',
        'field_type',
        'options',
        'is_required',
        'position',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
        'position' => 'integer',
    ];

    /**
     * Get the form that owns the field.
     */
    public function form(): BelongsTo
    {
        return $this->belongsTo(Form::class);
    }

    /**
     * Get the submission values for this field.
     */
    public function submissionValues()
    {
        return $this->hasMany(FormSubmissionValue::class, 'field_id');
    }

    /**
     * Get available field types.
     */
    public static function getFieldTypes(): array
    {
        return [
            'text' => 'Text Input',
            'textarea' => 'Text Area',
            'email' => 'Email',
            'phone' => 'Phone Number',
            'number' => 'Number',
            'dropdown' => 'Dropdown',
            'checkbox' => 'Checkbox',
            'date' => 'Date',
            'file' => 'File Upload',
        ];
    }

    /**
     * Check if field type has options.
     */
    public function hasOptions(): bool
    {
        return in_array($this->field_type, ['dropdown', 'checkbox']);
    }

    /**
     * Get options as array.
     */
    public function getOptionsArray(): array
    {
        if (!$this->options || !is_array($this->options)) {
            return [];
        }
        return $this->options;
    }

    /**
     * Validate field value based on type.
     */
    public function validateValue($value): array
    {
        $rules = [];
        $messages = [];

        if ($this->is_required) {
            $rules[] = 'required';
        } else {
            $rules[] = 'nullable';
        }

        switch ($this->field_type) {
            case 'email':
                $rules[] = 'email';
                $rules[] = 'max:255';
                break;
            case 'phone':
                $rules[] = 'regex:/^[6-9]\d{9}$|^\+91[6-9]\d{9}$/';
                $messages['regex'] = 'Please enter a valid Indian phone number.';
                break;
            case 'number':
                $rules[] = 'numeric';
                break;
            case 'date':
                $rules[] = 'date';
                break;
            case 'file':
                $rules[] = 'file';
                $rules[] = 'max:10240'; // 10MB max
                $rules[] = 'mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx';
                break;
            case 'dropdown':
                $options = $this->getOptionsArray();
                if (!empty($options)) {
                    $rules[] = 'in:' . implode(',', $options);
                }
                break;
            case 'checkbox':
                $options = $this->getOptionsArray();
                if (!empty($options)) {
                    $rules[] = 'array';
                    $rules[] = 'in:' . implode(',', $options);
                }
                break;
            default:
                $rules[] = 'string';
                if ($this->field_type === 'textarea') {
                    $rules[] = 'max:5000';
                } else {
                    $rules[] = 'max:255';
                }
                break;
        }

        return [
            'rules' => $rules,
            'messages' => $messages,
        ];
    }

    /**
     * Get display name for field type.
     */
    public function getTypeDisplayAttribute(): string
    {
        return self::getFieldTypes()[$this->field_type] ?? ucfirst($this->field_type);
    }
}