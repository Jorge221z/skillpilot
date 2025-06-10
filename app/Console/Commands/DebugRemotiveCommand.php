<?php

namespace App\Console\Commands;

use App\Services\JobSources\RemotiveService;
use Illuminate\Console\Command;

class DebugRemotiveCommand extends Command
{
    protected $signature = 'debug:remotive {--limit=1 : Número de ofertas a mostrar}';
    protected $description = 'Debug de la estructura de datos de Remotive';

    public function handle()
    {
        $this->info('🔍 Depurando estructura de datos de Remotive...');

        $remotiveService = new RemotiveService();
        $offers = $remotiveService->fetchOffers();

        if (empty($offers)) {
            $this->error('❌ No se obtuvieron ofertas');
            return 1;
        }

        $limit = $this->option('limit');
        $this->info("📊 Se obtuvieron " . count($offers) . " ofertas total");
        $this->info("🔍 Mostrando estructura de las primeras {$limit} ofertas:");

        foreach (array_slice($offers, 0, $limit) as $index => $offer) {
            $this->info("\n═══ Oferta " . ($index + 1) . " - Estructura completa ═══");

            // Mostrar todas las claves disponibles
            $this->info("🔑 Claves disponibles: " . implode(', ', array_keys($offer)));

            // Mostrar algunos campos importantes
            $this->info("📋 Datos importantes:");
            foreach ($offer as $key => $value) {
                if (is_string($value) && strlen($value) > 100) {
                    $value = substr($value, 0, 100) . '...';
                } elseif (is_array($value)) {
                    $value = '[' . implode(', ', array_slice($value, 0, 5)) . (count($value) > 5 ? '...' : '') . ']';
                }
                $this->info("   {$key}: " . ($value ?? 'NULL'));
            }
        }

        return 0;
    }
}
