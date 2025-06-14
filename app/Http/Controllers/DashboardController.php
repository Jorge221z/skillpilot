<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /* Este controlador Maneja toda la lógica compleja de recuperación de ofertas de trabajo,
    paginación y mapeo de datos que antes estaba en la ruta del dashboard.*/

    public function index(Request $request)
    {
        $user = Auth::user();

        // Obtener las ofertas del usuario con paginación
        $matchesPaginated = $user->jobMatches()
            ->with('jobOffer')
            ->latest()
            ->paginate(10);

        // Mapear los datos para el frontend
        $matches = $matchesPaginated->getCollection()->map(function ($match) {
            return [
                'id' => $match->id,
                'job_offer_id' => $match->job_offer_id,
                'match_score' => $match->match_score,
                'tags' => $match->tags,
                'ai_feedback' => $match->ai_feedback,
                'cover_letter' => $match->cover_letter,
                'created_at' => $match->created_at,
                'job_offer' => [
                    'id' => $match->jobOffer->id,
                    'title' => $match->jobOffer->title,
                    'company' => $match->jobOffer->company,
                    'description' => $match->jobOffer->description,
                    'location' => $match->jobOffer->location,
                    'tags' => $match->jobOffer->tags,
                    'url' => $match->jobOffer->url,
                    'source' => $match->jobOffer->source,
                    'created_at' => $match->jobOffer->created_at,
                ]
            ];
        });

        // Reemplazar la colección en el paginador
        $matchesPaginated->setCollection($matches);

        return Inertia::render('dashboard', [
            'jobMatches' => $matchesPaginated,
            'totalMatches' => $user->jobMatches()->count()
        ]);
    }
}
