<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobOffer;
use App\Models\UserJobOffer;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AIMatchController extends Controller
{
    private AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    /**
     * Analiza la compatibilidad entre un usuario y una oferta de trabajo
     */
    public function analyzeJobMatch(Request $request): JsonResponse
    {
        $request->validate([
            'job_offer_id' => 'required|exists:job_offers,id',
            'user_id' => 'sometimes|exists:users,id'
        ]);

        $userId = $request->input('user_id', Auth::id());
        $jobOfferId = $request->input('job_offer_id');

        try {
            $user = User::with('profile')->findOrFail($userId);
            $jobOffer = JobOffer::findOrFail($jobOfferId);

            // Preparar datos del usuario
            $userProfile = [
                'name' => $user->name,
                'experience' => $user->profile->parsed_cv ?? '',
                'skills' => $user->profile->skills ?? [],
                'education' => $user->profile->parsed_cv ?? '',
                'location' => '',
                'desired_position' => $user->profile->desired_position ?? '',
            ];

            // Preparar datos de la oferta
            $jobOfferData = [
                'title' => $jobOffer->title,
                'company' => $jobOffer->company,
                'description' => $jobOffer->description,
                'location' => $jobOffer->location,
                'tags' => $jobOffer->tags ?? [],
            ];

            // Llamar al servicio de IA
            $analysis = $this->aiService->analyzeJobMatch($userProfile, $jobOfferData);

            if (!$analysis['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al analizar la compatibilidad',
                    'error' => $analysis['error']
                ], 500);
            }

            // Parsear la respuesta JSON de la IA
            $aiResponse = json_decode($analysis['content'], true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                // Si no es JSON válido, usar el contenido como feedback directo
                $aiResponse = [
                    'match_score' => 75, // Score por defecto
                    'summary' => $analysis['content']
                ];
            }

            // Guardar o actualizar el match
            $userJobOffer = UserJobOffer::updateOrCreate(
                [
                    'user_id' => $userId,
                    'job_offer_id' => $jobOfferId
                ],
                [
                    'match_score' => $aiResponse['match_score'] ?? 75,
                    'ai_feedback' => $analysis['content'],
                    'tags' => $aiResponse['strengths'] ?? [],
                ]
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'match_id' => $userJobOffer->id,
                    'match_score' => $userJobOffer->match_score,
                    'analysis' => $aiResponse,
                    'job_offer' => $jobOffer,
                ],
                'message' => 'Análisis completado exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en analyzeJobMatch: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error' => config('app.debug') ? $e->getMessage() : 'Error al procesar la solicitud'
            ], 500);
        }
    }

    /**
     * Genera una carta de presentación para una oferta específica
     */
    public function generateCoverLetter(Request $request): JsonResponse
    {
        $request->validate([
            'job_offer_id' => 'required|exists:job_offers,id',
            'user_id' => 'sometimes|exists:users,id'
        ]);

        $userId = $request->input('user_id', Auth::id());
        $jobOfferId = $request->input('job_offer_id');

        try {
            $user = User::with('profile')->findOrFail($userId);
            $jobOffer = JobOffer::findOrFail($jobOfferId);

            $userProfile = [
                'name' => $user->name,
                'experience' => $user->profile->parsed_cv ?? '',
                'skills' => $user->profile->skills ?? [],
                'education' => $user->profile->parsed_cv ?? '',
                'desired_position' => $user->profile->desired_position ?? '',
            ];

            $jobOfferData = [
                'title' => $jobOffer->title,
                'company' => $jobOffer->company,
                'description' => $jobOffer->description,
            ];

            $coverLetter = $this->aiService->generateCoverLetter($userProfile, $jobOfferData);

            if (!$coverLetter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al generar la carta de presentación'
                ], 500);
            }

            // Actualizar el registro con la carta generada
            $userJobOffer = UserJobOffer::where('user_id', $userId)
                ->where('job_offer_id', $jobOfferId)
                ->first();

            if ($userJobOffer) {
                $userJobOffer->update(['cover_letter' => $coverLetter]);
            } else {
                $userJobOffer = UserJobOffer::create([
                    'user_id' => $userId,
                    'job_offer_id' => $jobOfferId,
                    'cover_letter' => $coverLetter,
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'cover_letter' => $coverLetter,
                    'match_id' => $userJobOffer->id,
                ],
                'message' => 'Carta de presentación generada exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en generateCoverLetter: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Genera feedback para mejorar el perfil del usuario
     */
    public function generateProfileFeedback(Request $request): JsonResponse
    {
        $request->validate([
            'job_offer_id' => 'required|exists:job_offers,id',
            'user_id' => 'sometimes|exists:users,id'
        ]);

        $userId = $request->input('user_id', Auth::id());
        $jobOfferId = $request->input('job_offer_id');

        try {
            $user = User::with('profile')->findOrFail($userId);
            $jobOffer = JobOffer::findOrFail($jobOfferId);

            $userProfile = [
                'experience' => $user->profile->parsed_cv ?? '',
                'skills' => $user->profile->skills ?? [],
                'education' => $user->profile->parsed_cv ?? '',
                'desired_position' => $user->profile->desired_position ?? '',
            ];

            $jobOfferData = [
                'title' => $jobOffer->title,
                'company' => $jobOffer->company,
                'description' => $jobOffer->description,
            ];

            $feedback = $this->aiService->generateProfileFeedback($userProfile, $jobOfferData);

            if (!$feedback) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al generar el feedback'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'feedback' => $feedback,
                    'job_offer' => $jobOffer->only(['title', 'company']),
                ],
                'message' => 'Feedback generado exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en generateProfileFeedback: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor'
            ], 500);
        }
    }

    /**
     * Obtiene todos los matches de un usuario
     */
    public function getUserMatches(Request $request): JsonResponse
    {
        $userId = $request->input('user_id', Auth::id());

        try {
            $matches = UserJobOffer::with('jobOffer')
                ->where('user_id', $userId)
                ->orderBy('match_score', 'desc')
                ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $matches,
                'message' => 'Matches obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en getUserMatches: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los matches'
            ], 500);
        }
    }

    /**
     * Obtiene un match específico con todos sus detalles
     */
    public function getMatchDetails(Request $request, $matchId): JsonResponse
    {
        try {
            $match = UserJobOffer::with(['jobOffer', 'user.profile'])
                ->findOrFail($matchId);

            // Verificar que el usuario autenticado puede ver este match
            if ($match->user_id !== Auth::id() && !Auth::user()->is_admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para ver este match'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $match,
                'message' => 'Detalles del match obtenidos exitosamente'
            ]);

        } catch (\Exception $e) {
            Log::error('Error en getMatchDetails: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los detalles del match'
            ], 500);
        }
    }
}
