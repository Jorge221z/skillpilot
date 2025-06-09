<?php

namespace App\Http\Controllers;

use App\Models\UserJobOffer;
use App\Models\UserProfile;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AIAnalysisController extends Controller
{
    protected AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Analiza una oferta de trabajo específica con IA
     */
    public function analyzeJobOffer(Request $request, $jobMatchId)
    {
        try {
            // Validar que el match pertenece al usuario autenticado
            $jobMatch = UserJobOffer::where('id', $jobMatchId)
                ->where('user_id', Auth::id())
                ->with('jobOffer')
                ->firstOrFail();

            // Obtener el perfil del usuario
            $userProfile = UserProfile::where('user_id', Auth::id())->first();

            if (!$userProfile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Perfil de usuario no encontrado. Por favor, completa tu perfil primero.'
                ], 404);
            }

            // Preparar datos para el análisis de IA
            $userProfileData = [
                'name' => $userProfile->full_name ?? Auth::user()->name,
                'experience' => $userProfile->experience ?? '',
                'skills' => $userProfile->skills ?? [],
                'desired_position' => $userProfile->desired_position ?? ''
            ];

            $jobOfferData = [
                'title' => $jobMatch->jobOffer->title,
                'company' => $jobMatch->jobOffer->company,
                'description' => $jobMatch->jobOffer->description,
                'location' => $jobMatch->jobOffer->location,
                'tags' => $jobMatch->jobOffer->tags ?? []
            ];

            // Realizar análisis con IA
            $aiResponse = $this->aiService->analyzeJobMatch($userProfileData, $jobOfferData);

            if (!$aiResponse['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al procesar el análisis con IA: ' . $aiResponse['error']
                ], 500);
            }

            // Parsear la respuesta JSON de la IA
            $aiContent = trim($aiResponse['content']);

            // Limpiar la respuesta de posibles caracteres markdown
            $cleanContent = $this->cleanAIResponse($aiContent);

            Log::info('AI Analysis Response', [
                'job_match_id' => $jobMatchId,
                'raw_content' => $aiContent,
                'clean_content' => $cleanContent
            ]);

            $analysisData = json_decode($cleanContent, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Error parsing AI response JSON', [
                    'job_match_id' => $jobMatchId,
                    'raw_content' => $aiContent,
                    'clean_content' => $cleanContent,
                    'json_error' => json_last_error_msg()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Error al procesar la respuesta de IA. Inténtalo de nuevo.'
                ], 500);
            }

            // Validar estructura de la respuesta
            if (!isset($analysisData['recomendaciones']) || !isset($analysisData['carta'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Respuesta de IA incompleta. Inténtalo de nuevo.'
                ], 500);
            }

            // Actualizar el registro con los resultados del análisis
            $jobMatch->update([
                'ai_feedback' => $analysisData['recomendaciones'],
                'cover_letter' => $analysisData['carta'],
                'match_score' => $this->calculateMatchScore($analysisData['recomendaciones']),
                'tags' => array_merge($jobMatch->tags ?? [], ['ai_analyzed'])
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Análisis completado exitosamente',
                'data' => [
                    'recomendaciones' => $analysisData['recomendaciones'],
                    'carta' => $analysisData['carta'],
                    'match_score' => $jobMatch->match_score,
                    'analyzed_at' => now()->toISOString()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error in AI analysis', [
                'job_match_id' => $jobMatchId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor. Inténtalo de nuevo.'
            ], 500);
        }
    }

    /**
     * Obtiene el análisis existente de una oferta de trabajo
     */
    public function getAnalysis($jobMatchId)
    {
        try {
            $jobMatch = UserJobOffer::where('id', $jobMatchId)
                ->where('user_id', Auth::id())
                ->with('jobOffer')
                ->firstOrFail();

            // Verificar si ya tiene análisis de IA
            if (empty($jobMatch->ai_feedback) || empty($jobMatch->cover_letter)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Esta oferta aún no ha sido analizada con IA.',
                    'has_analysis' => false
                ]);
            }

            return response()->json([
                'success' => true,
                'has_analysis' => true,
                'data' => [
                    'recomendaciones' => $jobMatch->ai_feedback,
                    'carta' => $jobMatch->cover_letter,
                    'match_score' => $jobMatch->match_score,
                    'job_offer' => [
                        'title' => $jobMatch->jobOffer->title,
                        'company' => $jobMatch->jobOffer->company,
                        'location' => $jobMatch->jobOffer->location
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting AI analysis', [
                'job_match_id' => $jobMatchId,
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el análisis.'
            ], 500);
        }
    }

    /**
     * Calcula un puntaje de match básico basado en las recomendaciones
     */
    private function calculateMatchScore(array $recommendations): int
    {
        // Lógica simple: más recomendaciones = menor match score
        $baseScore = 85;
        $penalty = count($recommendations) * 5;

        return max(50, min($baseScore - $penalty, 100));
    }

    /**
     * Limpia la respuesta de IA removiendo caracteres markdown y texto extra
     */
    private function cleanAIResponse(string $content): string
    {
        // Remover bloques de código markdown (```json ... ```)
        $content = preg_replace('/```(?:json)?\s*(.*?)\s*```/s', '$1', $content);

        // Remover cualquier texto antes del primer {
        $firstBrace = strpos($content, '{');
        if ($firstBrace !== false) {
            $content = substr($content, $firstBrace);
        }

        // Remover cualquier texto después del último }
        $lastBrace = strrpos($content, '}');
        if ($lastBrace !== false) {
            $content = substr($content, 0, $lastBrace + 1);
        }

        return trim($content);
    }
}
