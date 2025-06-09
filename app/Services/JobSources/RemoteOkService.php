<?php

namespace App\Services\JobSources;

use App\Models\JobOffer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RemoteOkService implements JobSourceInterface
{
    /**
     * Obtiene ofertas de trabajo desde RemoteOK
     */
    public function fetchOffers(): array
    {
        try {
            $config = config('job_sources.sources.remoteok', []);

            if (!($config['enabled'] ?? true)) {
                Log::info('RemoteOK source is disabled');
                return [];
            }

            $apiUrl = $config['api_url'] ?? 'https://remoteok.com/api';
            $timeout = $config['timeout'] ?? 30;

            $response = Http::timeout($timeout)
                ->withHeaders([
                    'Accept' => 'application/json',
                ])
                ->get($apiUrl);

            $offers = $response->json();

            if (empty($offers)) {
                return [];
            }

            // Aplicar límite máximo de ofertas
            $maxOffers = config('job_sources.global.max_offers_per_source', 100);
            if (count($offers) > $maxOffers) {
                $offers = array_slice($offers, 0, $maxOffers);
            }

            return collect($offers)->toArray();
        } catch (\Exception $e) {
            Log::error('Error fetching offers from RemoteOK: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Filtra ofertas basándose en el perfil del usuario
     */
    public function filterOffers(array $offers, $profile): array
    {
        return collect($offers)->filter(function ($offer) use ($profile) {
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
        })->toArray();
    }

    /**
     * Convierte una oferta del formato de la fuente al formato estándar
     */
    public function normalizeOffer(array $offer): array
    {
        return [
            'title' => $offer['position'],
            'company' => $offer['company'],
            'description' => $this->cleanDescription($offer['description'] ?? ''),
            'location' => $offer['location'] ?? null,
            'tags' => isset($offer['tags']) ? $offer['tags'] : null,
            'url' => $offer['url'],
            'source' => 'remoteok',
            'hash' => hash('sha256', $offer['position'] . $offer['company'] . $offer['url']),
        ];
    }

    /**
     * Obtiene el nombre de la fuente
     */
    public function getSourceName(): string
    {
        return 'remoteok';
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
