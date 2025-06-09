<?php

use App\Http\Controllers\UserPreferencesController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = Auth::user();

        // Obtener las ofertas del usuario con la información de la oferta de trabajo
        $matches = $user->jobMatches()
            ->with('jobOffer')
            ->latest()
            ->take(10) // Limitar a las 10 más recientes para el dashboard
            ->get()
            ->map(function ($match) {
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

        return Inertia::render('dashboard', [
            'jobMatches' => $matches,
            'totalMatches' => $user->jobMatches()->count()
        ]);
    })->name('dashboard');

    Route::get('profile', function () {
        $userProfile = \App\Models\UserProfile::where('user_id', Auth::id())->first();
        return Inertia::render('profile', [
            'userProfile' => $userProfile
        ]);
    })->name('profile');

    // Rutas para User Preferences
    Route::post('profile/process-cv', [UserPreferencesController::class, 'processCV'])->name('profile.process-cv');
    Route::get('profile/data', [UserPreferencesController::class, 'getUserProfile'])->name('profile.data');
    Route::put('profile/update', [UserPreferencesController::class, 'updateProfile'])->name('profile.update');

    // Rutas para Job Search
    Route::post('jobs/fetch-and-match', [\App\Http\Controllers\JobSearchController::class, 'fetchAndMatch'])->name('jobs.fetch-and-match');
    Route::get('jobs/matches', [\App\Http\Controllers\JobSearchController::class, 'getMatches'])->name('jobs.matches');

    // Rutas para AI Analysis
    Route::post('ai/analyze/{jobMatchId}', [\App\Http\Controllers\AIAnalysisController::class, 'analyzeJobOffer'])->name('ai.analyze');
    Route::get('ai/analysis/{jobMatchId}', [\App\Http\Controllers\AIAnalysisController::class, 'getAnalysis'])->name('ai.get-analysis');
    
    // Ruta para Chatbot
    Route::get('chatbot', function () {
        return Inertia::render('chatbot');
    })->name('chatbot');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
