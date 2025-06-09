<?php

namespace App\Services\JobSources;

use App\Models\JobOffer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LinkedInService implements JobSourceInterface
{
    /**
     * Obtiene ofertas de trabajo desde LinkedIn
     * NOTA: Este es un ejemplo. LinkedIn requiere autenticación y APIs específicas.
     */
    public function fetchOffers(): array
    {
        try {
            // EJEMPLO: En una implementación real, necesitarías:
            // - API Key de LinkedIn
            // - Manejo de autenticación OAuth
            // - Endpoints específicos de LinkedIn Jobs API

            /* Ejemplo de implementación:
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.linkedin.api_key'),
                'Accept' => 'application/json',
            ])->get('https://api.linkedin.com/v2/jobSearch', [
                'keywords' => 'developer',
                'location' => 'remote',
                'count' => 50,
            ]);

            return $response->json()['elements'] ?? [];
            */

            // Por ahora, retornamos array vacío como placeholder
            Log::info('LinkedIn service called - implementation pending');
            return [];

        } catch (\Exception $e) {
            Log::error('Error fetching offers from LinkedIn: ' . $e->getMessage());
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
            if (!isset($offer['title']) || !isset($offer['description']) || !isset($offer['skills'])) {
                return false;
            }

            // 1. Verificar coincidencia en el título
            $titleMatch = $this->isReasonableTitleMatch($offer['title'], $profile->desired_position);

            if (!$titleMatch) {
                return false;
            }

            // 2. Verificar coincidencia de habilidades
            $skillsMatch = $this->hasSufficientSkillMatch($offer['skills'], $profile->skills);

            return $titleMatch && $skillsMatch;
        })->toArray();
    }

    /**
     * Convierte una oferta del formato de LinkedIn al formato estándar
     */
    public function normalizeOffer(array $offer): array
    {
        return [
            'title' => $offer['title'],
            'company' => $offer['companyName'] ?? 'N/A',
            'description' => $this->cleanDescription($offer['description'] ?? ''),
            'location' => $offer['location'] ?? null,
            'tags' => $offer['skills'] ?? null,
            'url' => $offer['jobUrl'] ?? null,
            'source' => 'linkedin',
            'hash' => hash('sha256', $offer['title'] . ($offer['companyName'] ?? '') . ($offer['jobUrl'] ?? '')),
        ];
    }

    /**
     * Obtiene el nombre de la fuente
     */
    public function getSourceName(): string
    {
        return 'linkedin';
    }

    /**
     * Limpia el contenido HTML de una descripción
     */
    private function cleanDescription($description)
    {
        if (empty($description)) {
            return '';
        }

        $description = html_entity_decode($description, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $description = strip_tags($description);
        $description = preg_replace('/\s+/', ' ', $description);
        $description = trim($description);

        return $description;
    }

    /**
     * Verifica coincidencia en títulos
     */
    private function isReasonableTitleMatch($offerTitle, $desiredPosition)
    {
        $offerTitle = strtolower(trim($offerTitle));
        $desiredPosition = strtolower(trim($desiredPosition));

        if (str_contains($offerTitle, $desiredPosition) || str_contains($desiredPosition, $offerTitle)) {
            return true;
        }

        $similarity = 0;
        similar_text($offerTitle, $desiredPosition, $similarity);

        return $similarity >= 60;
    }

    /**
     * Verifica coincidencia de habilidades
     */
    private function hasSufficientSkillMatch($offerSkills, $userSkills)
    {
        if (!is_array($offerSkills) || !is_array($userSkills)) {
            return false;
        }

        $offerSkills = array_map('strtolower', array_map('trim', $offerSkills));
        $userSkills = array_map('strtolower', array_map('trim', $userSkills));

        $matches = array_intersect($userSkills, $offerSkills);

        return count($matches) >= 2;
    }
}
