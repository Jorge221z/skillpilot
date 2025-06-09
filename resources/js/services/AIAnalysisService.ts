import axios from 'axios';

interface AIAnalysisResponse {
    success: boolean;
    message: string;
    data?: {
        recomendaciones: string[];
        carta: string;
        match_score: number;
        analyzed_at: string;
    };
    has_analysis?: boolean;
}

interface JobMatch {
    id: number;
    job_offer_id: number;
    match_score: number | null;
    tags: string[] | null;
    ai_feedback: string[] | null;
    cover_letter: string | null;
    created_at: string;
    job_offer: {
        id: number;
        title: string;
        company: string;
        description: string;
        location: string | null;
        tags: string[] | null;
        url: string;
        source: string;
        created_at: string;
    };
}

export class AIAnalysisService {
    /**
     * Inicia el análisis de IA para una oferta de trabajo específica
     */
    static async analyzeJobOffer(jobMatchId: number): Promise<AIAnalysisResponse> {
        try {
            const response = await axios.post(`/ai/analyze/${jobMatchId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data;
            }
            return {
                success: false,
                message: 'Error de conexión. Inténtalo de nuevo.'
            };
        }
    }

    /**
     * Obtiene el análisis existente de una oferta de trabajo
     */
    static async getExistingAnalysis(jobMatchId: number): Promise<AIAnalysisResponse> {
        try {
            const response = await axios.get(`/ai/analysis/${jobMatchId}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response.data;
            }
            return {
                success: false,
                message: 'Error al obtener el análisis.'
            };
        }
    }

    /**
     * Verifica si una oferta de trabajo ya tiene análisis de IA
     */
    static hasAIAnalysis(jobMatch: JobMatch): boolean {
        return !!(
            Array.isArray(jobMatch.ai_feedback) &&
            jobMatch.ai_feedback.length > 0 &&
            jobMatch.cover_letter &&
            jobMatch.cover_letter.trim().length > 0
        );
    }

    /**
     * Obtiene el puntaje de match formateado
     */
    static getFormattedMatchScore(score: number | null): string {
        if (score === null) return 'Sin analizar';
        return `${score}%`;
    }

    /**
     * Obtiene el color del badge según el puntaje de match
     */
    static getMatchScoreColor(score: number | null): string {
        if (score === null) return 'bg-gray-100 text-gray-800';
        if (score >= 80) return 'bg-green-100 text-green-800';
        if (score >= 60) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    }

    /**
     * Formatea las recomendaciones para mostrar en el UI
     */
    static formatRecommendations(recommendations: string[]): string {
        return recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n');
    }
}

export default AIAnalysisService;
