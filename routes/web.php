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
        return Inertia::render('dashboard');
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
