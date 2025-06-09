<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use App\Models\JobOffer;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class JobSearchController extends Controller
{
    private AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }
    public function fetchAndMatch(Request $request)
    {
        $user = Auth::user(); // Obtener perfil del usuario autenticado
        $profile = $user->profile; //Usamos el perfil del usuario para obtener sus preferencias

        if (!$profile || !$profile->desired_position || !$profile->skills) { // Verificar si el perfil está completo
            return back()->with('error', 'Por favor, completa tu perfil antes de buscar ofertas de trabajo.');
        }

        /** A partir de aqui comienza la parte de scraping(de momento solo lo hacemos con remoteOK) */

        $response = Http::withHeaders([  //scrapeamos la api de remoteOK//
            'Accept' => 'application/json',
            ])->get('https://remoteok.com/api');

        $offers = $response->json(); //lo pasamos a json//
        if (empty($offers)) {
            return back()->with('error', 'No se encontraron ofertas de trabajo en RemoteOK.');
        }

        // Convertir a colección para poder usar filter
        $offers = collect($offers);

        $matches = $offers->filter(function ($offer) use ($profile) {
            // Verificar que los campos necesarios existen
            if (!isset($offer['position']) || !isset($offer['description']) || !isset($offer['tags'])) {
                return false;
            }

            // 1. Verificar coincidencia razonable en el título del puesto
            $titleMatch = $this->isReasonableTitleMatch($offer['position'], $profile->desired_position);

            if (!$titleMatch) {
                return false; // Si no hay match en el título, descartar directamente
            }

            // 2. Verificar coincidencia de al menos 2 tecnologías
            $techMatch = $this->hasSufficientTechMatch($offer['tags'], $profile->skills);

            return $titleMatch && $techMatch; // Ambas condiciones deben cumplirse
        });

        // Guardar las ofertas coincidentes en la base de datos
        $processedCount = 0;
        foreach ($matches as $offer) {
            // Verificar que los campos obligatorios existen
            if (!isset($offer['position']) || !isset($offer['company']) || !isset($offer['url'])) {
                continue;
            }

            // Generar hash único para evitar duplicados
            $hash = hash('sha256', $offer['position'] . $offer['company'] . $offer['url']);

            // Crear o actualizar la oferta en job_offers
            $jobOffer = JobOffer::updateOrCreate(
                ['hash' => $hash],
                [
                    'title' => $offer['position'],
                    'company' => $offer['company'],
                    'description' => $this->cleanDescription($offer['description'] ?? ''),
                    'location' => $offer['location'] ?? null,
                    'tags' => isset($offer['tags']) ? $offer['tags'] : null,
                    'url' => $offer['url'],
                    'source' => 'remoteok',
                    'hash' => $hash,
                ]
            );

            // Crear la relación usuario-oferta en user_job_offers
            $user->jobMatches()->updateOrCreate(
                ['job_offer_id' => $jobOffer->id],
                [
                    'user_id' => $user->id,
                    'job_offer_id' => $jobOffer->id,
                ]
            );

            $processedCount++;
        }

        // Redirigir de vuelta con mensaje de éxito
        return back()->with('success', "Se encontraron {$processedCount} ofertas coincidentes. Ahora puedes analizarlas con IA desde tu dashboard.");
    }

    /**
     * Procesa una oferta con IA para generar recomendaciones y carta
     */
    private function processWithAI($user, $jobOffer, $userJobOffer)
    {
        try {
            // Preparar datos del usuario
            $userProfile = [
                'name' => $user->name,
                'experience' => $user->profile->parsed_cv ?? '',
                'skills' => $user->profile->skills ?? [],
                'desired_position' => $user->profile->desired_position ?? '',
            ];

            // Preparar datos de la oferta
            $jobOfferData = [
                'title' => $jobOffer->title,
                'company' => $jobOffer->company,
                'description' => $jobOffer->description,
                'location' => $jobOffer->location,
                'tags' => $jobOffer->tags ?? [],
            ];

            // Llamar al servicio de IA
            $aiResponse = $this->aiService->analyzeJobMatch($userProfile, $jobOfferData);

            if ($aiResponse['success']) {
                // Parsear la respuesta JSON de la IA
                $aiData = json_decode($aiResponse['content'], true);

                if ($aiData && isset($aiData['recomendaciones']) && isset($aiData['carta'])) {
                    // Actualizar el registro con los datos de la IA
                    $userJobOffer->update([
                        'ai_feedback' => json_encode($aiData['recomendaciones']),
                        'cover_letter' => $aiData['carta'],
                    ]);
                } else {
                    // Si no es JSON válido, guardar el contenido completo como feedback
                    $userJobOffer->update([
                        'ai_feedback' => $aiResponse['content'],
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Log del error pero no interrumpir el flujo
            Log::error('Error procesando oferta con IA: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'job_offer_id' => $jobOffer->id,
            ]);
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
     * Limpia el contenido HTML de una descripción
     */
    private function cleanDescription($description)
    {
        if (empty($description)) {
            return '';
        }

        // Convertir entidades HTML
        $description = html_entity_decode($description, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Eliminar todas las etiquetas HTML
        $description = strip_tags($description);

        // Limpiar espacios en blanco excesivos
        $description = preg_replace('/\s+/', ' ', $description);

        // Eliminar espacios al inicio y final
        $description = trim($description);

        return $description;
    }

    /**
     * Verifica si hay una coincidencia razonable entre el título de la oferta y el puesto deseado
     */
    private function isReasonableTitleMatch($offerTitle, $desiredPosition)
    {
        $offerTitle = strtolower(trim($offerTitle));
        $desiredPosition = strtolower(trim($desiredPosition));

        // Coincidencia exacta por substring
        if (str_contains($offerTitle, $desiredPosition) || str_contains($desiredPosition, $offerTitle)) {
            return true;
        }

        // Usar similar_text para calcular similitud
        $similarity = 0;
        similar_text($offerTitle, $desiredPosition, $similarity);

        // Considerar match si la similitud es >= 70%
        if ($similarity >= 60) {
            return true;
        }

        // Usar levenshtein para distancia de edición (solo para strings cortos)
        if (strlen($offerTitle) <= 50 && strlen($desiredPosition) <= 50) {
            $distance = levenshtein($offerTitle, $desiredPosition);
            $maxLength = max(strlen($offerTitle), strlen($desiredPosition));

            // Si la distancia es menor al 30% de la longitud máxima
            $similarity_pct = (1 - ($distance / $maxLength)) * 100;
            if ($similarity_pct >= 70) {
                return true;
            }
        }

        return false;
    }

    /**
     * Verifica si hay al menos 2 tecnologías coincidentes
     */
    private function hasSufficientTechMatch($offerTags, $userSkills)
    {
        if (!is_array($offerTags) || !is_array($userSkills)) {
            return false;
        }

        // Normalizar arrays a minúsculas
        $offerTechs = array_map('strtolower', array_map('trim', $offerTags));
        $userTechs = array_map('strtolower', array_map('trim', $userSkills));

        // Encontrar coincidencias exactas
        $exactMatches = array_intersect($userTechs, $offerTechs);

        if (count($exactMatches) >= 2) {
            return true;
        }

        // Si no hay suficientes coincidencias exactas, buscar coincidencias parciales
        $partialMatches = [];
        foreach ($userTechs as $userTech) {
            foreach ($offerTechs as $offerTech) {
                // Buscar si una tecnología está contenida en la otra
                if (str_contains($userTech, $offerTech) || str_contains($offerTech, $userTech)) {
                    $partialMatches[] = [$userTech, $offerTech];
                    continue 2; // Pasar al siguiente userTech
                }

                // Usar similar_text para coincidencias aproximadas
                $similarity = 0;
                similar_text($userTech, $offerTech, $similarity);
                if ($similarity >= 80) { // 80% de similitud para tecnologías
                    $partialMatches[] = [$userTech, $offerTech];
                    continue 2; // Pasar al siguiente userTech
                }
            }
        }

        // Combinar coincidencias exactas y parciales
        $totalMatches = count($exactMatches) + count($partialMatches);

        return $totalMatches >= 2;
    }
}
