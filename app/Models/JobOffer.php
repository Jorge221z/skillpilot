<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    protected $fillable = [
        'title',
        'company',
        'description',
        'location',
        'tags',
        'url',
        'source',
        'hash',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function matches()
    {
        return $this->hasMany(UserJobOffer::class);
    }
}
