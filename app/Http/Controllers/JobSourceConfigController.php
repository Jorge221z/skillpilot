<?php

namespace App\Http\Controllers;

use App\Services\JobSourceManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobSourceConfigController extends Controller
{
    private JobSourceManager $jobSourceManager;

    public function __construct(JobSourceManager $jobSourceManager)
    {
        $this->jobSourceManager = $jobSourceManager;
    }

    /**
     * Muestra la página de configuración de fuentes
     */
    public function index()
    {
        $sources = $this->jobSourceManager->getSources();
        $sourceInfo = [];

        foreach ($sources as $name => $source) {
            $sourceInfo[] = [
                'name' => $name,
                'displayName' => ucfirst(str_replace(['-', '_'], ' ', $name)),
                'className' => get_class($source),
                'isActive' => true, // Por ahora todas están activas
            ];
        }

        return Inertia::render('Admin/JobSources', [
            'sources' => $sourceInfo,
            'totalSources' => count($sourceInfo)
        ]);
    }

    /**
     * Prueba una fuente específica
     */
    public function testSource(Request $request, string $sourceName)
    {
        $user = Auth::user();

        if (!$user->profile || !$user->profile->desired_position || !$user->profile->skills) {
            return response()->json([
                'success' => false,
                'message' => 'Tu perfil debe estar completo para probar las fuentes'
            ], 400);
        }

        $source = $this->jobSourceManager->getSource($sourceName);

        if (!$source) {
            return response()->json([
                'success' => false,
                'message' => "Fuente '{$sourceName}' no encontrada"
            ], 404);
        }

        try {
            // Obtener ofertas sin guardarlas
            $offers = $source->fetchOffers();
            $totalOffers = count($offers);

            if (empty($offers)) {
                return response()->json([
                    'success' => true,
                    'message' => "La fuente '{$sourceName}' no devolvió ofertas",
                    'data' => [
                        'total_offers' => 0,
                        'filtered_offers' => 0,
                        'sample_offer' => null
                    ]
                ]);
            }

            // Filtrar ofertas según el perfil
            $filteredOffers = $source->filterOffers($offers, $user->profile);
            $totalFiltered = count($filteredOffers);

            // Obtener una muestra de oferta normalizada
            $sampleOffer = null;
            if (!empty($filteredOffers)) {
                $normalizedSample = $source->normalizeOffer($filteredOffers[0]);
                $sampleOffer = [
                    'title' => $normalizedSample['title'],
                    'company' => $normalizedSample['company'],
                    'location' => $normalizedSample['location'],
                    'source' => $normalizedSample['source'],
                    'has_description' => !empty($normalizedSample['description']),
                    'has_tags' => !empty($normalizedSample['tags']),
                    'has_url' => !empty($normalizedSample['url']),
                ];
            }

            return response()->json([
                'success' => true,
                'message' => "Prueba de '{$sourceName}' completada exitosamente",
                'data' => [
                    'total_offers' => $totalOffers,
                    'filtered_offers' => $totalFiltered,
                    'sample_offer' => $sampleOffer,
                    'filter_rate' => $totalOffers > 0 ? round(($totalFiltered / $totalOffers) * 100, 2) : 0
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => "Error probando '{$sourceName}': " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtiene estadísticas de todas las fuentes
     */
    public function getStats()
    {
        $user = Auth::user();

        if (!$user->profile) {
            return response()->json([
                'success' => false,
                'message' => 'Perfil de usuario requerido'
            ], 400);
        }

        $sources = $this->jobSourceManager->getSources();
        $stats = [];

        foreach ($sources as $name => $source) {
            try {
                $offers = $source->fetchOffers();
                $totalOffers = count($offers);

                $filteredOffers = [];
                if ($user->profile->desired_position && $user->profile->skills) {
                    $filteredOffers = $source->filterOffers($offers, $user->profile);
                }

                $stats[$name] = [
                    'name' => $name,
                    'total_offers' => $totalOffers,
                    'filtered_offers' => count($filteredOffers),
                    'last_checked' => now()->toISOString(),
                    'status' => $totalOffers > 0 ? 'active' : 'inactive'
                ];
            } catch (\Exception $e) {
                $stats[$name] = [
                    'name' => $name,
                    'total_offers' => 0,
                    'filtered_offers' => 0,
                    'last_checked' => now()->toISOString(),
                    'status' => 'error',
                    'error' => $e->getMessage()
                ];
            }
        }

        return response()->json([
            'success' => true,
            'stats' => array_values($stats),
            'total_sources' => count($stats)
        ]);
    }

    /**
     * Ejecuta una búsqueda de prueba en tiempo real
     */
    public function runTestSearch(Request $request)
    {
        $user = Auth::user();

        if (!$user->profile || !$user->profile->desired_position || !$user->profile->skills) {
            return response()->json([
                'success' => false,
                'message' => 'Perfil completo requerido para ejecutar búsqueda de prueba'
            ], 400);
        }

        $sourceName = $request->input('source');

        if ($sourceName) {
            // Probar fuente específica
            $result = $this->jobSourceManager->fetchFromSource($sourceName, $user, $user->profile);
        } else {
            // Probar todas las fuentes
            $result = $this->jobSourceManager->fetchAndProcessOffers($user, $user->profile);
        }

        return response()->json([
            'success' => true,
            'result' => $result
        ]);
    }
}
