<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuración de Fuentes de Ofertas de Trabajo
    |--------------------------------------------------------------------------
    |
    | Aquí puedes configurar las diferentes fuentes de ofertas de trabajo
    | que usa la aplicación. Cada fuente puede tener su propia configuración.
    |
    */

    'sources' => [
        'remoteok' => [
            'enabled' => env('REMOTEOK_ENABLED', true),
            'api_url' => env('REMOTEOK_API_URL', 'https://remoteok.com/api'),
            'rate_limit' => env('REMOTEOK_RATE_LIMIT', 60), // requests per minute
            'timeout' => env('REMOTEOK_TIMEOUT', 30), // seconds
        ],

        'linkedin' => [
            'enabled' => env('LINKEDIN_ENABLED', false),
            'api_key' => env('LINKEDIN_API_KEY'),
            'api_secret' => env('LINKEDIN_API_SECRET'),
            'api_url' => env('LINKEDIN_API_URL', 'https://api.linkedin.com/v2'),
            'rate_limit' => env('LINKEDIN_RATE_LIMIT', 100),
            'timeout' => env('LINKEDIN_TIMEOUT', 30),
        ],

        'indeed' => [
            'enabled' => env('INDEED_ENABLED', false),
            'api_key' => env('INDEED_API_KEY'),
            'base_url' => env('INDEED_BASE_URL', 'https://indeed.com'),
            'rate_limit' => env('INDEED_RATE_LIMIT', 30),
            'timeout' => env('INDEED_TIMEOUT', 45),
            'user_agent' => env('INDEED_USER_AGENT', 'SkillPilot JobBot/1.0'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Configuración Global
    |--------------------------------------------------------------------------
    */

    'global' => [
        // Número máximo de ofertas a procesar por fuente en una sola ejecución
        'max_offers_per_source' => env('JOB_SOURCES_MAX_OFFERS', 100),

        // Tiempo de caché para ofertas (en minutos)
        'cache_ttl' => env('JOB_SOURCES_CACHE_TTL', 60),

        // Habilitar logging detallado
        'detailed_logging' => env('JOB_SOURCES_DETAILED_LOGGING', false),

        // Retry automático en caso de error
        'auto_retry' => env('JOB_SOURCES_AUTO_RETRY', true),
        'max_retries' => env('JOB_SOURCES_MAX_RETRIES', 3),

        // Filtros globales
        'min_skill_matches' => env('JOB_SOURCES_MIN_SKILL_MATCHES', 2),
        'title_similarity_threshold' => env('JOB_SOURCES_TITLE_SIMILARITY', 60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Filtros de Calidad
    |--------------------------------------------------------------------------
    */

    'quality_filters' => [
        // Palabras clave que deben evitarse en títulos
        'blacklisted_keywords' => [
            'scam', 'pyramid', 'mlm', 'commission only', 'unpaid'
        ],

        // Dominios de empresas que deben evitarse
        'blacklisted_domains' => [
            'spam-company.com'
        ],

        // Longitud mínima de descripción
        'min_description_length' => 50,

        // Requerir URL válida
        'require_valid_url' => true,
    ],
];
