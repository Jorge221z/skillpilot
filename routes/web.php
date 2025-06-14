<?php

use App\Http\Controllers\UserPreferencesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'home'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('profile', [ProfileController::class, 'show'])->name('profile');

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
    Route::get('chatbot', [PageController::class, 'chatbot'])->name('chatbot');

    // Ruta para Sobre el Proyecto
    Route::get('about', [PageController::class, 'about'])->name('about');

    // Ruta para Términos y Condiciones
    Route::get('terms-and-conditions', [PageController::class, 'termsAndConditions'])->name('terms-and-conditions');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
