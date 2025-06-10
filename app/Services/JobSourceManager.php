<?php

namespace App\Services;

use App\Services\JobSources\JobSourceInterface;
use App\Services\JobSources\RemoteOkService;
use App\Services\JobSources\RemotiveService;
use App\Models\JobOffer;
use Illuminate\Support\Facades\Log;

class JobSourceManager
{
    /**
     * Array de servicios de fuentes de ofertas disponibles
     */
    protected array $sources = [];

    public function __construct()
    {
        // Registrar las fuentes disponibles
        $this->registerSource(new RemoteOkService());
        $this->registerSource(new RemotiveService());

        // Aquí se pueden añadir más fuentes en el futuro:
        // $this->registerSource(new LinkedInService());
        // $this->registerSource(new IndeedService()); // Descomenta cuando esté listo
    }

    /**
     * Registra una nueva fuente de ofertas
     */
    public function registerSource(JobSourceInterface $source): void
    {
        $this->sources[$source->getSourceName()] = $source;
    }

    /**
     * Obtiene todas las fuentes registradas
     */
    public function getSources(): array
    {
        return $this->sources;
    }

    /**
     * Obtiene una fuente específica por nombre
     */
    public function getSource(string $name): ?JobSourceInterface
    {
        return $this->sources[$name] ?? null;
    }

    /**
     * Busca y procesa ofertas de todas las fuentes
     */
    public function fetchAndProcessOffers($user, $profile): array
    {
        $results = [];
        $totalProcessed = 0;

        foreach ($this->sources as $sourceName => $source) {
            try {
                Log::info("Procesando ofertas desde {$sourceName}");

                // 1. Obtener ofertas de la fuente
                $rawOffers = $source->fetchOffers();

                if (empty($rawOffers)) {
                    Log::warning("No se encontraron ofertas en {$sourceName}");
                    $results[$sourceName] = [
                        'success' => false,
                        'message' => "No se encontraron ofertas en {$sourceName}",
                        'processed' => 0
                    ];
                    continue;
                }

                // 2. Filtrar ofertas según el perfil
                $filteredOffers = $source->filterOffers($rawOffers, $profile);

                if (empty($filteredOffers)) {
                    Log::info("No se encontraron ofertas coincidentes en {$sourceName}");
                    $results[$sourceName] = [
                        'success' => true,
                        'message' => "No se encontraron ofertas coincidentes en {$sourceName}",
                        'processed' => 0
                    ];
                    continue;
                }

                // 3. Procesar y guardar ofertas
                $processedCount = $this->saveOffers($user, $source, $filteredOffers);
                $totalProcessed += $processedCount;

                $results[$sourceName] = [
                    'success' => true,
                    'message' => "Se procesaron {$processedCount} ofertas desde {$sourceName}",
                    'processed' => $processedCount
                ];

                Log::info("Procesadas {$processedCount} ofertas desde {$sourceName}");

            } catch (\Exception $e) {
                Log::error("Error procesando ofertas desde {$sourceName}: " . $e->getMessage());
                $results[$sourceName] = [
                    'success' => false,
                    'message' => "Error procesando ofertas desde {$sourceName}: " . $e->getMessage(),
                    'processed' => 0
                ];
            }
        }

        return [
            'results' => $results,
            'total_processed' => $totalProcessed
        ];
    }

    /**
     * Guarda las ofertas filtradas en la base de datos
     */
    private function saveOffers($user, JobSourceInterface $source, array $offers): int
    {
        $processedCount = 0;

        foreach ($offers as $rawOffer) {
            try {
                // Normalizar la oferta al formato estándar
                $normalizedOffer = $source->normalizeOffer($rawOffer);

                // Verificar que los campos obligatorios existen
                if (!isset($normalizedOffer['title']) || !isset($normalizedOffer['company']) || !isset($normalizedOffer['url'])) {
                    continue;
                }

                // Crear o actualizar la oferta en job_offers
                $jobOffer = JobOffer::updateOrCreate(
                    ['hash' => $normalizedOffer['hash']],
                    $normalizedOffer
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

            } catch (\Exception $e) {
                Log::error("Error guardando oferta: " . $e->getMessage());
                continue;
            }
        }

        return $processedCount;
    }

    /**
     * Busca ofertas solo desde una fuente específica
     */
    public function fetchFromSource(string $sourceName, $user, $profile): array
    {
        $source = $this->getSource($sourceName);

        if (!$source) {
            return [
                'success' => false,
                'message' => "Fuente {$sourceName} no encontrada",
                'processed' => 0
            ];
        }

        try {
            $rawOffers = $source->fetchOffers();

            if (empty($rawOffers)) {
                return [
                    'success' => false,
                    'message' => "No se encontraron ofertas en {$sourceName}",
                    'processed' => 0
                ];
            }

            $filteredOffers = $source->filterOffers($rawOffers, $profile);

            if (empty($filteredOffers)) {
                return [
                    'success' => true,
                    'message' => "No se encontraron ofertas coincidentes en {$sourceName}",
                    'processed' => 0
                ];
            }

            $processedCount = $this->saveOffers($user, $source, $filteredOffers);

            return [
                'success' => true,
                'message' => "Se procesaron {$processedCount} ofertas desde {$sourceName}",
                'processed' => $processedCount
            ];

        } catch (\Exception $e) {
            Log::error("Error procesando ofertas desde {$sourceName}: " . $e->getMessage());
            return [
                'success' => false,
                'message' => "Error procesando ofertas desde {$sourceName}: " . $e->getMessage(),
                'processed' => 0
            ];
        }
    }
}
