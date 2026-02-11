<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'actor_user_id',
        'action',
        'target_type',
        'target_id',
        'metadata',
        'ip_address',
        'user_agent',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the actor user.
     */
    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_user_id');
    }

    /**
     * Get the target model.
     */
    public function target()
    {
        if ($this->target_type && $this->target_id) {
            $class = 'App\\Models\\' . $this->target_type;
            if (class_exists($class)) {
                return $this->belongsTo($class, 'target_id');
            }
        }
        return null;
    }

    /**
     * Create a new audit log entry.
     */
    public static function log(string $action, $target = null, array $metadata = [], $request = null)
    {
        $data = [
            'actor_user_id' => auth()->id(),
            'action' => $action,
            'metadata' => $metadata,
        ];

        if ($target) {
            $data['target_type'] = class_basename($target);
            $data['target_id'] = $target->id;
        }

        if ($request) {
            $data['ip_address'] = $request->ip();
            $data['user_agent'] = substr($request->userAgent() ?? '', 0, 500);
        }

        return self::create($data);
    }
}