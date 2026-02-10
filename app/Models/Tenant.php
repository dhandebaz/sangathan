<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Tenant extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'name',
        'domain',
        'database',
        'status',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}