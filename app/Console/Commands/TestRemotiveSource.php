<?php

namespace App\Console\Commands;

use App\Services\JobSources\RemotiveService;
use Illuminate\Console\Command;

class TestRemotiveSource extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'test:remotive {--limit=5 : Número de ofertas a mostrar}';

    /**
     * The console command description.
     */
    protected $description = 'Prueba la integración con Remotive API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Probando integración con Remotive...');
        $this->newLine();

        $remotiveService = new RemotiveService();
        $limit = $this->option('limit');

        try {
            // Obtener ofertas
            $this->info('📡 Obteniendo ofertas de Remotive...');
            $offers = $remotiveService->fetchOffers();

            if (empty($offers)) {
                $this->warn('⚠️  No se obtuvieron ofertas de Remotive');
                return;
            }

            $this->info("✅ Se obtuvieron " . count($offers) . " ofertas");
            $this->newLine();

            // Mostrar algunas ofertas
            $this->info("🔍 Mostrando las primeras {$limit} ofertas:");
            $this->newLine();

            $displayOffers = array_slice($offers, 0, $limit);

            foreach ($displayOffers as $index => $offer) {
                $this->line("═══ Oferta " . ($index + 1) . " ═══");
                $this->line("🏢 Empresa: " . ($offer['company_name'] ?? 'N/A'));
                $this->line("💼 Título: " . ($offer['job_title'] ?? 'N/A'));
                $this->line("📍 Ubicación: Remote");

                if (!empty($offer['tags'])) {
                    $this->line("🏷️  Tags: " . implode(', ', array_slice($offer['tags'], 0, 5)));
                }

                if (!empty($offer['salary'])) {
                    $this->line("💰 Salario: " . $offer['salary']);
                }

                if (!empty($offer['url'])) {
                    $this->line("🔗 URL: " . $offer['url']);
                }

                $this->newLine();
            }

            // Probar normalización
            $this->info('🔄 Probando normalización de ofertas...');

            if (!empty($offers)) {
                $normalizedOffer = $remotiveService->normalizeOffer($offers[0]);

                $this->line("═══ Oferta Normalizada ═══");
                $this->line("Título: " . $normalizedOffer['title']);
                $this->line("Empresa: " . $normalizedOffer['company']);
                $this->line("Fuente: " . $normalizedOffer['source']);
                $this->line("Ubicación: " . $normalizedOffer['location']);
                $this->newLine();
            }

            $this->info('✅ Prueba completada exitosamente');

        } catch (\Exception $e) {
            $this->error('❌ Error durante la prueba: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
        }
    }
}
