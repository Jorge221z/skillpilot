<?php

namespace App\Console\Commands;

use App\Services\JobSourceManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;

class TestJobSources extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'job-sources:test {--source= : Test a specific source} {--user= : User ID to test with}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test job sources to verify they are working correctly';

    /**
     * Execute the console command.
     */
    public function handle(JobSourceManager $jobSourceManager)
    {
        $this->info('🔍 Probando sistema de fuentes de ofertas de trabajo...');

        // Obtener usuario para prueba
        $userId = $this->option('user') ?? 1;
        $user = \App\Models\User::find($userId);

        if (!$user || !$user->profile) {
            $this->error("❌ Usuario con ID {$userId} no encontrado o sin perfil completo");
            return Command::FAILURE;
        }

        $this->info("👤 Probando con usuario: {$user->name} (ID: {$user->id})");

        // Mostrar fuentes disponibles
        $sources = $jobSourceManager->getSources();
        $this->info("📋 Fuentes disponibles: " . implode(', ', array_keys($sources)));

        $specificSource = $this->option('source');

        if ($specificSource) {
            // Probar fuente específica
            $this->testSpecificSource($jobSourceManager, $user, $specificSource);
        } else {
            // Probar todas las fuentes
            $this->testAllSources($jobSourceManager, $user);
        }

        return Command::SUCCESS;
    }

    private function testSpecificSource(JobSourceManager $manager, $user, string $sourceName)
    {
        $this->info("🎯 Probando fuente específica: {$sourceName}");

        $source = $manager->getSource($sourceName);
        if (!$source) {
            $this->error("❌ Fuente '{$sourceName}' no encontrada");
            return;
        }

        $this->info("📡 Obteniendo ofertas desde {$sourceName}...");
        $offers = $source->fetchOffers();
        $this->info("✅ Ofertas obtenidas: " . count($offers));

        if (!empty($offers)) {
            $this->info("🔍 Filtrando ofertas según perfil del usuario...");
            $filtered = $source->filterOffers($offers, $user->profile);
            $this->info("✅ Ofertas filtradas: " . count($filtered));

            if (!empty($filtered)) {
                $this->info("🔄 Normalizando primera oferta como ejemplo...");
                $normalized = $source->normalizeOffer($filtered[0]);
                $this->table(
                    ['Campo', 'Valor'],
                    [
                        ['title', $normalized['title'] ?? 'N/A'],
                        ['company', $normalized['company'] ?? 'N/A'],
                        ['location', $normalized['location'] ?? 'N/A'],
                        ['source', $normalized['source'] ?? 'N/A'],
                        ['url', substr($normalized['url'] ?? 'N/A', 0, 50) . '...'],
                    ]
                );
            }
        }
    }

    private function testAllSources(JobSourceManager $manager, $user)
    {
        $this->info("🌐 Probando todas las fuentes disponibles...");

        $result = $manager->fetchAndProcessOffers($user, $user->profile);

        $this->info("📊 Resultados:");
        $this->info("Total procesadas: {$result['total_processed']}");

        $tableData = [];
        foreach ($result['results'] as $sourceName => $sourceResult) {
            $tableData[] = [
                $sourceName,
                $sourceResult['success'] ? '✅ Éxito' : '❌ Error',
                $sourceResult['processed'],
                $sourceResult['message']
            ];
        }

        $this->table(['Fuente', 'Estado', 'Procesadas', 'Mensaje'], $tableData);
    }
}
