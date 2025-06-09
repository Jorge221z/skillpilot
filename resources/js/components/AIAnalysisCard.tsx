import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Brain, FileText, Loader2, CheckCircle } from 'lucide-react';
import AIAnalysisService from '@/services/AIAnalysisService';

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
        location: string;
        tags: string[] | null;
        url: string;
        source: string;
        created_at: string;
    };
}

interface AIAnalysisCardProps {
    jobMatch: JobMatch;
    onAnalysisComplete: (jobMatchId: number, analysisData: any) => void;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ jobMatch, onAnalysisComplete }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Validar que jobMatch tiene la estructura correcta
    if (!jobMatch || !jobMatch.job_offer) {
        return (
            <Card className="w-full">
                <CardContent className="p-4">
                    <p className="text-red-600">Error: Datos de oferta no válidos</p>
                </CardContent>
            </Card>
        );
    }

    const hasAnalysis = AIAnalysisService.hasAIAnalysis(jobMatch);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const response = await AIAnalysisService.analyzeJobOffer(jobMatch.id);

            if (response.success && response.data) {
                setAnalysisData(response.data);
                onAnalysisComplete(jobMatch.id, response.data);
            } else {
                setError(response.message || 'Error al analizar la oferta');
            }
        } catch (err) {
            setError('Error de conexión. Inténtalo de nuevo.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const loadExistingAnalysis = async () => {
        if (hasAnalysis) {
            try {
                const response = await AIAnalysisService.getExistingAnalysis(jobMatch.id);
                if (response.success && response.data) {
                    setAnalysisData(response.data);
                }
            } catch (err) {
                console.error('Error loading existing analysis:', err);
            }
        }
    };

    React.useEffect(() => {
        loadExistingAnalysis();
    }, [jobMatch.id, hasAnalysis]);

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-blue-600" />
                            Análisis con IA
                        </CardTitle>
                        <CardDescription>
                            {jobMatch.job_offer.title} en {jobMatch.job_offer.company}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            className={AIAnalysisService.getMatchScoreColor(jobMatch.match_score)}
                        >
                            {AIAnalysisService.getFormattedMatchScore(jobMatch.match_score)}
                        </Badge>
                        {hasAnalysis && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Analizado
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                {!hasAnalysis && !analysisData && (
                    <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                            Esta oferta aún no ha sido analizada con IA.
                        </p>
                        <Button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Analizando...
                                </>
                            ) : (
                                <>
                                    <Brain className="h-4 w-4 mr-2" />
                                    Analizar con IA
                                </>
                            )}
                        </Button>
                    </div>
                )}

                {(hasAnalysis || analysisData) && (
                    <Tabs defaultValue="recommendations" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
                            <TabsTrigger value="cover-letter">Carta de Presentación</TabsTrigger>
                        </TabsList>

                        <TabsContent value="recommendations" className="mt-4">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    Recomendaciones para mejorar tu candidatura:
                                </h4>
                                <div className="space-y-2">
                                    {(() => {
                                        // Obtener las recomendaciones de forma segura
                                        const recommendations = analysisData?.recomendaciones ||
                                                              (Array.isArray(jobMatch.ai_feedback) ? jobMatch.ai_feedback : []);

                                        if (!Array.isArray(recommendations) || recommendations.length === 0) {
                                            return (
                                                <div className="p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-gray-600 text-sm">No hay recomendaciones disponibles.</p>
                                                </div>
                                            );
                                        }

                                        return recommendations.map((rec: string, index: number) => (
                                            <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-800 text-sm">{rec}</p>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="cover-letter" className="mt-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-3">
                                    <FileText className="h-4 w-4 text-gray-600" />
                                    <h4 className="font-semibold text-gray-900">
                                        Carta de Presentación Personalizada
                                    </h4>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                                        {analysisData?.carta || jobMatch.cover_letter || 'Carta no disponible'}
                                    </p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const text = analysisData?.carta || jobMatch.cover_letter || '';
                                            navigator.clipboard.writeText(text);
                                        }}
                                    >
                                        Copiar Carta
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const element = document.createElement('a');
                                            const file = new Blob([analysisData?.carta || jobMatch.cover_letter || ''], {type: 'text/plain'});
                                            element.href = URL.createObjectURL(file);
                                            element.download = `carta-${jobMatch.job_offer.company}-${jobMatch.job_offer.title}.txt`;
                                            document.body.appendChild(element);
                                            element.click();
                                            document.body.removeChild(element);
                                        }}
                                    >
                                        Descargar
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {!hasAnalysis && !analysisData && !isAnalyzing && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            💡 <strong>Tip:</strong> El análisis con IA te proporcionará recomendaciones específicas
                            para mejorar tu candidatura y una carta de presentación personalizada para esta oferta.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AIAnalysisCard;
