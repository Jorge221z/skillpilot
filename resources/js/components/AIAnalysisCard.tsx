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
        location: string | null;
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
        <div className="w-full">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {!hasAnalysis && !analysisData && (
                <div className="p-2">
                    <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        variant="outline"
                        size="sm"
                        className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/30"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Analizando...
                            </>
                        ) : (
                            <>
                                <Brain className="h-3 w-3 mr-2" />
                                Analizar
                            </>
                        )}
                    </Button>
                </div>
            )}

            {(hasAnalysis || analysisData) && (
                <div className="space-y-4 p-2">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Análisis completado</span>
                    </div>
                    
                    <Tabs defaultValue="recommendations" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-9 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                            <TabsTrigger 
                                value="recommendations" 
                                className="text-sm data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-400 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-300"
                            >
                                Recomendaciones
                            </TabsTrigger>
                            <TabsTrigger 
                                value="cover-letter" 
                                className="text-sm data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 data-[state=active]:border-gray-400 dark:data-[state=active]:bg-gray-700/50 dark:data-[state=active]:text-gray-300"
                            >
                                Carta
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="recommendations" className="mt-4 px-1">
                            <div className="space-y-3">
                                {(() => {
                                    const recommendations = analysisData?.recomendaciones ||
                                                          (Array.isArray(jobMatch.ai_feedback) ? jobMatch.ai_feedback : []);

                                    if (!Array.isArray(recommendations) || recommendations.length === 0) {
                                        return (
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">No hay recomendaciones disponibles.</p>
                                            </div>
                                        );
                                    }

                                    return recommendations.map((rec: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                                            <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{rec}</p>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </TabsContent>

                        <TabsContent value="cover-letter" className="mt-4 px-1">
                            <div className="space-y-3">
                                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-line">
                                        {analysisData?.carta || jobMatch.cover_letter || 'Carta no disponible'}
                                    </p>
                                </div>
                                <div className="flex gap-3 px-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => {
                                            const text = analysisData?.carta || jobMatch.cover_letter || '';
                                            navigator.clipboard.writeText(text);
                                        }}
                                    >
                                        📋 Copiar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
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
                                        📄 Descargar
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

export default AIAnalysisCard;
