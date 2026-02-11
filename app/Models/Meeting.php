<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Meeting extends Model
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
        'meeting_type',
        'meeting_date',
        'meeting_time',
        'location',
        'agenda',
        'decisions',
        'action_points',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'meeting_date' => 'date',
        'meeting_time' => 'datetime:H:i',
    ];

    /**
     * Meeting types.
     */
    const TYPES = [
        'general' => 'General Meeting',
        'core' => 'Core Committee Meeting',
        'emergency' => 'Emergency Meeting',
    ];

    /**
     * Get the organisation that owns the meeting.
     */
    public function organisation(): BelongsTo
    {
        return $this->belongsTo(Organisation::class);
    }

    /**
     * Get the user who created the meeting.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the attendees for the meeting.
     */
    public function attendees(): BelongsToMany
    {
        return $this->belongsToMany(Member::class, 'meeting_attendees')
                    ->withTimestamps();
    }

    /**
     * Scope to filter meetings by organisation.
     */
    public function scopeForOrganisation($query, $organisationId)
    {
        return $query->where('organisation_id', $organisationId);
    }

    /**
     * Scope to filter meetings by type.
     */
    public function scopeByType($query, $type)
    {
        return $query->where('meeting_type', $type);
    }

    /**
     * Scope to order meetings by date.
     */
    public function scopeOrderByDate($query, $direction = 'desc')
    {
        return $query->orderBy('meeting_date', $direction)
                    ->orderBy('meeting_time', $direction);
    }

    /**
     * Get formatted meeting date and time.
     */
    public function getFormattedDateTimeAttribute(): string
    {
        return $this->meeting_date->format('d M Y') . ' at ' . 
               date('h:i A', strtotime($this->meeting_time));
    }

    /**
     * Get display name for meeting type.
     */
    public function getTypeDisplayAttribute(): string
    {
        return self::TYPES[$this->meeting_type] ?? ucfirst($this->meeting_type);
    }

    /**
     * Get Jitsi room name for this meeting.
     */
    public function getJitsiRoomNameAttribute(): string
    {
        return 'sangathan-' . $this->organisation_id . '-' . $this->id;
    }

    /**
     * Check if meeting is in the future.
     */
    public function getIsUpcomingAttribute(): bool
    {
        $meetingDateTime = $this->meeting_date->format('Y-m-d') . ' ' . $this->meeting_time;
        return now()->lt($meetingDateTime);
    }

    /**
     * Get status badge class.
     */
    public function getStatusBadgeClassAttribute(): string
    {
        if ($this->is_upcoming) {
            return 'bg-blue-100 text-blue-800';
        }
        return 'bg-green-100 text-green-800';
    }

    /**
     * Get status display text.
     */
    public function getStatusDisplayAttribute(): string
    {
        return $this->is_upcoming ? 'Upcoming' : 'Completed';
    }
}