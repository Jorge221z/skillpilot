<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserJobOffer extends Model
{
    protected $fillable = [
        'user_id',
        'job_offer_id',
        'match_score',
        'tags',
        'ai_feedback',
        'cover_letter',
    ];

    protected $casts = [
        'tags' => 'array',
        'ai_feedback' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobOffer()
    {
        return $this->belongsTo(JobOffer::class);
    }
}
