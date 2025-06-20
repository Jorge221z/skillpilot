<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    protected $fillable = [
        'user_id',
        'desired_position',
        'skills',
        'parsed_cv',
        'cv_filename'
    ];

    protected $casts = [
        'skills' => 'array'
    ];

    /**
     * El siguiente metodo asocia el modelo User con el modelo UserProfile.
     */
    public function user()
    {
    return $this->belongsTo(User::class);
    }



}
