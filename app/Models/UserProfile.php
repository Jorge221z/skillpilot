<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{

    /**
     * El siguiente metodo asocia el modelo User con el modelo UserProfile.
     */
    public function user()
    {
    return $this->belongsTo(User::class);
    }



}
