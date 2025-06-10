<?php

namespace App\Services\JobSources;

use App\Models\JobOffer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RemotiveService implements JobSourceInterface
{
    /**
     * Obtiene ofertas de trabajo desde Remotive
     */
    public function fetchOffers(): array
    {
        try {
            $config = config('job_sources.sources.remotive', []);

            if (!($config['enabled'] ?? true)) {
                Log::info('Remotive source is disabled');
                return [];
            }

            $apiUrl = $config['api_url'] ?? 'https://remotive.com/api/remote-jobs';
            $timeout = $config['timeout'] ?? 30;

            // Construir parámetros de la URL
            $params = [];

            // Filtrar por categoría de desarrollo de software por defecto
            if (!empty($config['category'])) {
                $params['category'] = $config['category'];
            }

            $response = Http::timeout($timeout)
                ->withHeaders([
                    'Accept' => 'application/json',
                    'User-Agent' => $config['user_agent'] ?? 'SkillPilot JobBot/1.0',
                ])
                ->get($apiUrl, $params);

            if (!$response->successful()) {
                Log::error('Remotive API request failed: ' . $response->status());
                return [];
            }

            $data = $response->json();

            // Remotive devuelve los trabajos en la clave 'jobs'
            $offers = $data['jobs'] ?? [];

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
            Log::error('Error fetching offers from Remotive: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Filtra ofertas basándose en el perfil del usuario
     */
    public function filterOffers(array $offers, $profile): array
    {
        if (empty($offers) || !$profile) {
            return [];
        }

        $filteredOffers = [];
        $desiredPosition = strtolower(trim($profile->desired_position ?? ''));
        $userSkills = array_map('strtolower', array_map('trim', $profile->skills ?? []));

        $minSkillMatches = config('job_sources.global.min_skill_matches', 2);
        $titleSimilarityThreshold = config('job_sources.global.title_similarity_threshold', 60);

        foreach ($offers as $offer) {
            // Verificar campos obligatorios
            if (empty($offer['title']) || empty($offer['company_name'])) {
                continue;
            }

            // Filtrar por similitud de título
            if (!empty($desiredPosition)) {
                $offerTitle = strtolower(trim($offer['title']));
                if (!$this->isReasonableTitleMatch($offerTitle, $desiredPosition, $titleSimilarityThreshold)) {
                    continue;
                }
            }

            // Filtrar por coincidencia de tecnologías/skills
            if (!empty($userSkills)) {
                $offerTags = array_map('strtolower', array_map('trim', $offer['tags'] ?? []));
                if (!$this->hasSufficientTechMatch($offerTags, $userSkills, $minSkillMatches)) {
                    continue;
                }
            }

            // Aplicar filtros de calidad
            if (!$this->passesQualityFilters($offer)) {
                continue;
            }

            $filteredOffers[] = $offer;
        }

        return $filteredOffers;
    }

    /**
     * Convierte una oferta del formato de Remotive al formato estándar
     */
    public function normalizeOffer(array $offer): array
    {
        // Generar hash único basado en la URL o ID
        $hashSource = $offer['url'] ?? $offer['id'] ?? $offer['title'] . '-' . $offer['company_name'];
        $hash = md5($this->getSourceName() . '-' . $hashSource);

        return [
            'title' => $offer['title'] ?? '',
            'company' => $offer['company_name'] ?? '',
            'description' => $this->cleanDescription($offer['description'] ?? ''),
            'location' => 'Remote', // Remotive es solo trabajos remotos
            'tags' => $offer['tags'] ?? [],
            'url' => $offer['url'] ?? '',
            'source' => $this->getSourceName(),
            'hash' => $hash,
            'external_id' => $offer['id'] ?? null,
            'salary' => $offer['salary'] ?? null,
            'job_type' => $offer['job_type'] ?? null,
            'category' => $offer['category'] ?? null,
            'company_logo' => $offer['company_logo'] ?? null,
            'publication_date' => $offer['publication_date'] ?? null,
        ];
    }

    /**
     * Obtiene el nombre de la fuente
     */
    public function getSourceName(): string
    {
        return 'remotive';
    }

    /**
     * Verifica si hay una coincidencia razonable entre el título de la oferta y el puesto deseado
     */
    private function isReasonableTitleMatch(string $offerTitle, string $desiredPosition, int $threshold = 60): bool
    {
        // Coincidencia exacta por substring
        if (str_contains($offerTitle, $desiredPosition) || str_contains($desiredPosition, $offerTitle)) {
            return true;
        }

        // Usar similar_text para calcular similitud
        $similarity = 0;
        similar_text($offerTitle, $desiredPosition, $similarity);

        return $similarity >= $threshold;
    }

    /**
     * Verifica si hay suficientes tecnologías coincidentes
     */
    private function hasSufficientTechMatch(array $offerTags, array $userSkills, int $minMatches = 2): bool
    {
        if (empty($offerTags) || empty($userSkills)) {
            return false;
        }

        // Encontrar coincidencias exactas
        $exactMatches = array_intersect($userSkills, $offerTags);

        if (count($exactMatches) >= $minMatches) {
            return true;
        }

        // Si no hay suficientes coincidencias exactas, buscar coincidencias parciales
        $partialMatches = [];
        foreach ($userSkills as $userSkill) {
            foreach ($offerTags as $offerTag) {
                // Buscar si una tecnología está contenida en la otra
                if (str_contains($userSkill, $offerTag) || str_contains($offerTag, $userSkill)) {
                    $partialMatches[] = [$userSkill, $offerTag];
                    continue 2;
                }

                // Usar similar_text para coincidencias aproximadas
                $similarity = 0;
                similar_text($userSkill, $offerTag, $similarity);
                if ($similarity >= 80) {
                    $partialMatches[] = [$userSkill, $offerTag];
                    continue 2;
                }
            }
        }

        // Combinar coincidencias exactas y parciales
        $totalMatches = count($exactMatches) + count($partialMatches);

        return $totalMatches >= $minMatches;
    }

    /**
     * Aplica filtros de calidad a las ofertas
     */
    private function passesQualityFilters(array $offer): bool
    {
        $qualityFilters = config('job_sources.quality_filters', []);

        // Verificar palabras clave prohibidas
        $blacklistedKeywords = $qualityFilters['blacklisted_keywords'] ?? [];
        $title = strtolower($offer['title'] ?? '');
        $description = strtolower($offer['description'] ?? '');

        foreach ($blacklistedKeywords as $keyword) {
            if (str_contains($title, strtolower($keyword)) || str_contains($description, strtolower($keyword))) {
                return false;
            }
        }

        // Verificar longitud mínima de descripción
        $minDescriptionLength = $qualityFilters['min_description_length'] ?? 50;
        if (strlen($offer['description'] ?? '') < $minDescriptionLength) {
            return false;
        }

        // Verificar URL válida si es requerida
        if (($qualityFilters['require_valid_url'] ?? false) && empty($offer['url'])) {
            return false;
        }

        return true;
    }

    /**
     * Limpia el contenido HTML de una descripción
     */
    private function cleanDescription(string $description): string
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
}
