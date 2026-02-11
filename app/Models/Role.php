<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'display_name',
        'description',
    ];

    /**
     * The users that belong to the role.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'organisation_user')
                    ->withPivot('organisation_id', 'is_primary')
                    ->withTimestamps();
    }

    /**
     * The organisations that belong to the role.
     */
    public function organisations()
    {
        return $this->belongsToMany(Organisation::class, 'organisation_user')
                    ->withPivot('user_id', 'is_primary')
                    ->withTimestamps();
    }
}