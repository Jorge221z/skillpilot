<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Service Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for the AI service integration
    |
    */

    'endpoint' => env('DO_ENDPOINT', ''),
    'secret_key' => env('DO_SECRET_KEY', ''),

    // Configuraciones adicionales para el servicio de IA
    'timeout' => env('AI_TIMEOUT', 30),
    'max_tokens' => env('AI_MAX_TOKENS', 1500),
    'temperature' => env('AI_TEMPERATURE', 0.7),
    'model' => env('AI_MODEL', 'gpt-4'),
];
