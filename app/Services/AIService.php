<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class AIService
{
    private string $endpoint;
    private string $secretKey;

    public function __construct()
    {
        $this->endpoint = config('ai.endpoint');
        $this->secretKey = config('ai.secret_key');
    }

    /**
     * Analiza el match entre un usuario y una oferta de trabajo
     * Devuelve recomendaciones y carta de presentación en un solo request
     */
    public function analyzeJobMatch(array $userProfile, array $jobOffer): array
    {
        $prompt = $this->buildCompleteAnalysisPrompt($userProfile, $jobOffer);

        return $this->makeAIRequest($prompt, 'complete_job_analysis');
    }

    /**
     * Realiza la llamada HTTP a la API de DO
     */
    private function makeAIRequest(string $prompt, string $context = ''): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/json',
            ])->timeout(30)->post($this->endpoint, [
                'model' => 'Llama-3.3-70B-Instruct',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Eres un asistente experto en recursos humanos y análisis de perfiles laborales. Proporciona respuestas precisas y útiles en español.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.6,
                'max_tokens' => 1500,
            ]);

            if (!$response->successful()) {
                throw new Exception('Error en la respuesta de la API: ' . $response->status());
            }

            $data = $response->json();

            return [
                'success' => true,
                'content' => $data['choices'][0]['message']['content'] ?? '',
                'usage' => $data['usage'] ?? [],
                'context' => $context,
            ];

        } catch (Exception $e) {
            Log::error('Error en AIService: ' . $e->getMessage(), [
                'context' => $context,
                'prompt_length' => strlen($prompt),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'content' => '',
                'context' => $context,
            ];
        }
    }

    /**
     * Construye el prompt para análisis completo (recomendaciones + carta)
     */
    private function buildCompleteAnalysisPrompt(array $userProfile, array $jobOffer): string
    {
        return "
Analiza este perfil de usuario y esta oferta de trabajo, y proporciona recomendaciones específicas y una carta de presentación personalizada.

PERFIL DEL USUARIO:
- Nombre: {$userProfile['name']}
- CV y Experiencia: {$userProfile['experience']}
- Habilidades: " . implode(', ', $userProfile['skills'] ?? []) . "
- Posición deseada: {$userProfile['desired_position']}

OFERTA DE TRABAJO:
- Título: {$jobOffer['title']}
- Empresa: {$jobOffer['company']}
- Descripción: {$jobOffer['description']}
- Ubicación: {$jobOffer['location']}
- Habilidades requeridas: " . implode(', ', $jobOffer['tags'] ?? []) . "

INSTRUCCIONES:
1. Analiza la compatibilidad entre el perfil y la oferta
2. Identifica fortalezas del candidato para este puesto
3. Proporciona 3-5 recomendaciones específicas para mejorar las posibilidades
4. Genera una carta de presentación profesional de máximo 3 párrafos

FORMATO DE RESPUESTA REQUERIDO (JSON):
{
    \"recomendaciones\": [
        \"Recomendación específica 1\",
        \"Recomendación específica 2\",
        \"Recomendación específica 3\"
    ],
    \"carta\": \"Carta de presentación completa en formato texto, profesional pero cercana, máximo 3 párrafos\"
}

IMPORTANTE: Responde ÚNICAMENTE con el JSON válido, sin texto adicional antes o después. Las recomendaciones deben ser específicas y actionables. La carta debe ser personalizada para esta empresa y puesto específico.";
    }
}
