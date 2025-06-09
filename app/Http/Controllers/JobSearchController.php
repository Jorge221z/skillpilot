<?php

namespace App\Http\Controllers;

use App\Services\JobSourceManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class JobSearchController extends Controller
{
    private JobSourceManager $jobSourceManager;

    public function __construct(JobSourceManager $jobSourceManager)
    {
        $this->jobSourceManager = $jobSourceManager;
    }
    public function fetchAndMatch(Request $request)
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile || !$profile->desired_position || !$profile->skills) {
            return back()->with('error', 'Por favor, completa tu perfil antes de buscar ofertas de trabajo.');
        }

        try {
            // Usar el JobSourceManager para buscar en todas las fuentes
            $result = $this->jobSourceManager->fetchAndProcessOffers($user, $profile);

            $totalProcessed = $result['total_processed'];

            if ($totalProcessed > 0) {
                return back()->with('success', "Se encontraron {$totalProcessed} ofertas coincidentes. Ahora puedes analizarlas con IA desde tu dashboard.");
            } else {
                // Obtener detalles de los resultados para mostrar mensaje más específico
                $messages = [];
                foreach ($result['results'] as $sourceName => $sourceResult) {
                    if (!$sourceResult['success'] && $sourceResult['processed'] === 0) {
                        $messages[] = ucfirst($sourceName) . ': ' . $sourceResult['message'];
                    }
                }

                $detailMessage = !empty($messages) ? ' Detalles: ' . implode('; ', $messages) : '';
                return back()->with('warning', 'No se encontraron ofertas coincidentes en este momento.' . $detailMessage);
            }

        } catch (\Exception $e) {
            Log::error('Error en fetchAndMatch: ' . $e->getMessage());
            return back()->with('error', 'Ocurrió un error al buscar ofertas de trabajo. Por favor, inténtalo de nuevo.');
        }
    }

    public function getMatches()
    {
        $user = Auth::user();

        // Obtener las ofertas del usuario con la información de la oferta de trabajo
        $matches = $user->jobMatches()
            ->with('jobOffer')
            ->latest()
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

        return response()->json([
            'matches' => $matches,
            'total' => $matches->count()
        ]);
    }

    /**
     * Busca ofertas en una fuente específica
     */
    public function fetchFromSource(Request $request, string $sourceName)
    {
        $user = Auth::user();
        $profile = $user->profile;

        if (!$profile || !$profile->desired_position || !$profile->skills) {
            return back()->with('error', 'Por favor, completa tu perfil antes de buscar ofertas de trabajo.');
        }

        // Verificar que la fuente existe
        $source = $this->jobSourceManager->getSource($sourceName);
        if (!$source) {
            return back()->with('error', "La fuente '{$sourceName}' no está disponible.");
        }

        try {
            // Usar el JobSourceManager para buscar en la fuente específica
            $result = $this->jobSourceManager->fetchFromSource($sourceName, $user, $profile);

            if ($result['success'] && $result['processed'] > 0) {
                return back()->with('success', "Se encontraron {$result['processed']} ofertas coincidentes en " . ucfirst($sourceName) . ".");
            } else {
                return back()->with('warning', $result['message']);
            }

        } catch (\Exception $e) {
            Log::error("Error en fetchFromSource para {$sourceName}: " . $e->getMessage());
            return back()->with('error', "Ocurrió un error al buscar ofertas en " . ucfirst($sourceName) . ".");
        }
    }

    /**
     * Obtiene las fuentes disponibles
     */
    public function getSources()
    {
        $sources = $this->jobSourceManager->getSources();

        $sourcesInfo = [];
        foreach ($sources as $name => $source) {
            $sourcesInfo[] = [
                'name' => $name,
                'displayName' => ucfirst(str_replace(['-', '_'], ' ', $name)),
                'className' => get_class($source),
            ];
        }

        return response()->json([
            'sources' => $sourcesInfo,
            'total' => count($sourcesInfo)
        ]);
    }
}
