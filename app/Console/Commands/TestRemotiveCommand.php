<?php

namespace App\Console\Commands;

use App\Services\JobSources\RemotiveService;
use Illuminate\Console\Command;

class TestRemotiveCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:remotive {--limit=5 : Number of offers to display}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Remotive job source integration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Probando integración con Remotive...');
        $this->newLine();

        $remotiveService = new RemotiveService();
        $limit = $this->option('limit');

        // Test 1: Fetch offers
        $this->info('📡 Obteniendo ofertas de Remotive...');
        $offers = $remotiveService->fetchOffers();

        if (empty($offers)) {
            $this->error('❌ No se pudieron obtener ofertas de Remotive');
            return 1;
        }

        $this->info("✅ Se obtuvieron " . count($offers) . " ofertas");
        $this->newLine();

        // Test 2: Show raw data structure
        $this->info('🔍 Estructura de datos de la primera oferta:');
        if (!empty($offers)) {
            $firstOffer = $offers[0];
            $this->line('Campos disponibles: ' . implode(', ', array_keys($firstOffer)));
            $this->newLine();
        }

        // Test 3: Show sample offers
        $this->info("🔍 Mostrando las primeras {$limit} ofertas:");
        $this->newLine();

        $displayOffers = array_slice($offers, 0, $limit);
        foreach ($displayOffers as $index => $offer) {
            $offerNumber = $index + 1;
            $this->line("═══ Oferta {$offerNumber} ═══");

            // Mostrar la estructura completa para debugging
            $this->line("🔑 Claves disponibles: " . implode(', ', array_keys($offer)));
            $this->line("📋 Datos importantes:");
            $this->line("   title: " . ($offer['title'] ?? 'MISSING'));
            $this->line("   company_name: " . ($offer['company_name'] ?? 'MISSING'));

            $this->line("🏢 Empresa: " . ($offer['company_name'] ?? 'N/A'));
            $this->line("💼 Título: " . ($offer['title'] ?? 'N/A'));
            $this->line("📍 Ubicación: Remote");

            if (!empty($offer['tags']) && is_array($offer['tags'])) {
                $this->line("🏷️  Tags: " . implode(', ', array_slice($offer['tags'], 0, 5)));
            }

            if (!empty($offer['salary'])) {
                $this->line("💰 Salario: " . $offer['salary']);
            }

            $this->line("🔗 URL: " . ($offer['url'] ?? 'N/A'));
            $this->newLine();
        }

        // Test 4: Test normalization
        $this->info('🔄 Probando normalización de ofertas...');
        if (!empty($offers)) {
            $normalized = $remotiveService->normalizeOffer($offers[0]);
            $this->line("═══ Oferta Normalizada ═══");
            $this->line("Título: " . $normalized['title']);
            $this->line("Empresa: " . $normalized['company']);
            $this->line("Fuente: " . $normalized['source']);
            $this->line("Ubicación: " . $normalized['location']);
            $this->newLine();
        }

        $this->info('✅ Prueba completada exitosamente');
        return 0;
    }
}
