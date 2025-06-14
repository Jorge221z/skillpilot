<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- SEO Meta Tags --}}
        <meta name="description" content="{{ $page['props']['meta']['description'] ?? 'SkillPilot - Plataforma inteligente que busca ofertas de empleo adaptadas a tus preferencias y te ayuda a optimizar tu candidatura mediante IA.' }}">
        <meta name="keywords" content="{{ $page['props']['meta']['keywords'] ?? 'empleo, trabajo, ofertas de trabajo, IA, inteligencia artificial, candidatura, CV, búsqueda de empleo, SkillPilot' }}">
        <meta name="author" content="SkillPilot">
        <meta name="robots" content="index, follow">

        {{-- Open Graph / Facebook --}}
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:title" content="{{ $page['props']['meta']['title'] ?? config('app.name') }}">
        <meta property="og:description" content="{{ $page['props']['meta']['description'] ?? 'SkillPilot - Plataforma inteligente que busca ofertas de empleo adaptadas a tus preferencias y te ayuda a optimizar tu candidatura mediante IA.' }}">
        <meta property="og:image" content="{{ asset('skillpilot-logo.png') }}">
        <meta property="og:site_name" content="SkillPilot">

        {{-- Twitter --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:url" content="{{ url()->current() }}">
        <meta name="twitter:title" content="{{ $page['props']['meta']['title'] ?? config('app.name') }}">
        <meta name="twitter:description" content="{{ $page['props']['meta']['description'] ?? 'SkillPilot - Plataforma inteligente que busca ofertas de empleo adaptadas a tus preferencias y te ayuda a optimizar tu candidatura mediante IA.' }}">
        <meta name="twitter:image" content="{{ asset('skillpilot-logo.png') }}">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ url()->current() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ $page['props']['meta']['title'] ?? config('app.name', 'SkillPilot') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
