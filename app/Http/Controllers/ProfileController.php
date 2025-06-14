<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /* Este controlador recupera y muestra el perfil del usuario. */

    public function show()
    {
        $userProfile = UserProfile::where('user_id', Auth::id())->first();

        return Inertia::render('profile', [
            'userProfile' => $userProfile,
            'meta' => [
                'title' => 'Mi Perfil - SkillPilot',
                'description' => 'Gestiona tu perfil profesional y optimiza tu candidatura con las herramientas de IA de SkillPilot.',
                'keywords' => 'perfil, CV, candidatura, optimización, SkillPilot'
            ]
        ]);
    }
}
