<?php

namespace App\Console\Commands;

use App\Services\AIService;
use App\Models\User;
use App\Models\JobOffer;
use Illuminate\Console\Command;

class TestAIService extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ai:test {--user-id=1} {--job-offer-id=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the AI service with sample data';

    private AIService $aiService;

    public function __construct(AIService $aiService)
    {
        parent::__construct();
        $this->aiService = $aiService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->option('user-id');
        $jobOfferId = $this->option('job-offer-id');

        $this->info("🤖 Testing AI Service");
        $this->info("==================");

        try {
            // Verificar configuración
            $this->info("✅ Checking configuration...");
            $endpoint = config('ai.endpoint');
            $secretKey = config('ai.secret_key');

            if (empty($endpoint) || empty($secretKey)) {
                $this->error("❌ AI configuration is missing. Check your .env file.");
                return 1;
            }

            $this->info("   Endpoint: " . substr($endpoint, 0, 50) . "...");
            $this->info("   Secret Key: " . str_repeat('*', strlen($secretKey) - 4) . substr($secretKey, -4));

            // Buscar usuario y oferta
            $this->info("\n📊 Loading test data...");

            $user = User::with('profile')->find($userId);
            if (!$user) {
                $this->error("❌ User with ID {$userId} not found.");
                return 1;
            }

            $jobOffer = JobOffer::find($jobOfferId);
            if (!$jobOffer) {
                $this->error("❌ Job offer with ID {$jobOfferId} not found.");
                return 1;
            }

            $this->info("   User: {$user->name}");
            $this->info("   Job Offer: {$jobOffer->title} at {$jobOffer->company}");            // Preparar datos
            $userProfile = [
                'name' => $user->name,
                'experience' => $user->profile->parsed_cv ?? 'No CV uploaded yet',
                'skills' => $user->profile->skills ?? ['PHP', 'Laravel', 'JavaScript'],
                'desired_position' => $user->profile->desired_position ?? 'Software Developer',
            ];

            $jobOfferData = [
                'title' => $jobOffer->title,
                'company' => $jobOffer->company,
                'description' => $jobOffer->description,
                'location' => $jobOffer->location,
                'tags' => $jobOffer->tags ?? [],
            ];

            // Test: Analyze Job Match with AI
            $this->info("\n🎯 Testing Complete Job Analysis...");
            $analysis = $this->aiService->analyzeJobMatch($userProfile, $jobOfferData);

            if ($analysis['success']) {
                $this->info("✅ AI analysis successful!");
                $this->line("   Response length: " . strlen($analysis['content']) . " characters");

                // Try to parse JSON response
                $parsed = json_decode($analysis['content'], true);
                if ($parsed && isset($parsed['recomendaciones']) && isset($parsed['carta'])) {
                    $this->info("   Recommendations: " . count($parsed['recomendaciones']));
                    $this->info("   Cover letter length: " . strlen($parsed['carta']) . " characters");
                } else {
                    $this->warn("   Response is not in expected JSON format");
                }
            } else {
                $this->error("❌ AI analysis failed: " . $analysis['error']);
            }            $this->info("\n🎉 AI Service test completed!");

            // Show full results if requested
            if ($this->confirm('Do you want to see the full AI response?')) {
                $this->showFullResults($analysis);
            }

        } catch (\Exception $e) {
            $this->error("❌ Test failed with exception: " . $e->getMessage());
            $this->error("   File: " . $e->getFile() . ":" . $e->getLine());
            return 1;
        }

        return 0;
    }

    private function showFullResults($analysis)
    {
        $this->info("\n" . str_repeat("=", 60));
        $this->info("FULL AI RESPONSE");
        $this->info(str_repeat("=", 60));

        if ($analysis['success']) {
            $this->info("\n📊 COMPLETE AI ANALYSIS:");
            $this->info(str_repeat("-", 40));
            $this->line($analysis['content']);

            // Try to parse and show structured data
            $parsed = json_decode($analysis['content'], true);
            if ($parsed && isset($parsed['recomendaciones']) && isset($parsed['carta'])) {
                $this->info("\n🎯 PARSED RECOMMENDATIONS:");
                foreach ($parsed['recomendaciones'] as $index => $rec) {
                    $this->line(($index + 1) . ". " . $rec);
                }

                $this->info("\n📝 GENERATED COVER LETTER:");
                $this->line($parsed['carta']);
            }
        }
    }
}
