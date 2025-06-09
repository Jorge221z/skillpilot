<?php

namespace App\Services\JobSources;

use App\Models\JobOffer;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IndeedService implements JobSourceInterface
{
    /**
     * Obtiene ofertas de trabajo desde Indeed
     * NOTA: Este es un ejemplo. Indeed requiere scraping web o uso de APIs no oficiales.
     */
    public function fetchOffers(): array
    {
        try {
            // EJEMPLO: En una implementación real, podrías:
            // 1. Usar web scraping con bibliotecas como Goutte
            // 2. Usar APIs no oficiales (con precaución)
            // 3. Integrar con servicios de terceros que agreguen datos de Indeed

            /* Ejemplo conceptual de scraping:
            $response = Http::withHeaders([
                'User-Agent' => 'Mozilla/5.0 (compatible; JobBot/1.0)',
            ])->get('https://indeed.com/jobs', [
                'q' => 'developer',
                'l' => 'remote',
                'limit' => 50,
            ]);

            // Parsear HTML y extraer datos
            $crawler = new Crawler($response->body());
            $jobs = $crawler->filter('.job_seen_beacon')->each(function ($node) {
                return [
                    'title' => $node->filter('h2 a span')->text(),
                    'company' => $node->filter('.companyName')->text(),
                    'location' => $node->filter('.companyLocation')->text(),
                    'summary' => $node->filter('.summary')->text(),
                    'url' => 'https://indeed.com' . $node->filter('h2 a')->attr('href'),
                ];
            });

            return $jobs;
            */

            // Por ahora, retornamos datos de ejemplo para demostrar el patrón
            Log::info('Indeed service called - returning sample data');

            return [
                [
                    'title' => 'Senior PHP Developer',
                    'company' => 'Tech Company Example',
                    'location' => 'Remote',
                    'summary' => 'We are looking for a Senior PHP Developer with Laravel experience. Must have 5+ years of experience in web development.',
                    'url' => 'https://indeed.com/job/example-1',
                    'tags' => ['PHP', 'Laravel', 'MySQL', 'JavaScript'],
                    'salary' => '$80,000 - $120,000',
                ],
                [
                    'title' => 'Full Stack Developer',
                    'company' => 'Startup Inc',
                    'location' => 'Remote',
                    'summary' => 'Join our team as a Full Stack Developer. Experience with React, Node.js, and databases required.',
                    'url' => 'https://indeed.com/job/example-2',
                    'tags' => ['React', 'Node.js', 'MongoDB', 'TypeScript'],
                    'salary' => '$70,000 - $100,000',
                ]
            ];

        } catch (\Exception $e) {
            Log::error('Error fetching offers from Indeed: ' . $e->getMessage());
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
            if (!isset($offer['title']) || !isset($offer['summary']) || !isset($offer['tags'])) {
                return false;
            }

            // 1. Verificar coincidencia en el título
            $titleMatch = $this->isReasonableTitleMatch($offer['title'], $profile->desired_position);

            if (!$titleMatch) {
                return false;
            }

            // 2. Verificar coincidencia de tecnologías
            $techMatch = $this->hasSufficientTechMatch($offer['tags'], $profile->skills);

            return $titleMatch && $techMatch;
        })->toArray();
    }

    /**
     * Convierte una oferta del formato de Indeed al formato estándar
     */
    public function normalizeOffer(array $offer): array
    {
        // Extraer tecnologías del resumen si no hay tags
        $tags = $offer['tags'] ?? $this->extractTechnologiesFromText($offer['summary'] ?? '');

        return [
            'title' => $offer['title'],
            'company' => $offer['company'],
            'description' => $this->cleanDescription($offer['summary'] ?? ''),
            'location' => $offer['location'] ?? null,
            'tags' => $tags,
            'url' => $offer['url'],
            'source' => 'indeed',
            'hash' => hash('sha256', $offer['title'] . $offer['company'] . $offer['url']),
            'salary' => $offer['salary'] ?? null, // Campo adicional específico de Indeed
        ];
    }

    /**
     * Obtiene el nombre de la fuente
     */
    public function getSourceName(): string
    {
        return 'indeed';
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
     * Verifica coincidencia de tecnologías
     */
    private function hasSufficientTechMatch($offerTags, $userSkills)
    {
        if (!is_array($offerTags) || !is_array($userSkills)) {
            return false;
        }

        $offerTechs = array_map('strtolower', array_map('trim', $offerTags));
        $userTechs = array_map('strtolower', array_map('trim', $userSkills));

        $matches = array_intersect($userTechs, $offerTechs);

        return count($matches) >= 2;
    }

    /**
     * Extrae tecnologías comunes del texto de una descripción
     */
    private function extractTechnologiesFromText($text): array
    {
        $technologies = [
            'php', 'laravel', 'javascript', 'react', 'vue', 'angular', 'node.js', 'nodejs',
            'python', 'django', 'flask', 'java', 'spring', 'mysql', 'postgresql', 'mongodb',
            'redis', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'git', 'linux',
            'typescript', 'html', 'css', 'sass', 'tailwind', 'bootstrap'
        ];

        $text = strtolower($text);
        $found = [];

        foreach ($technologies as $tech) {
            if (str_contains($text, $tech)) {
                $found[] = $tech;
            }
        }

        return array_unique($found);
    }
}
