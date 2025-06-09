import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Search, Building2, MapPin, Calendar, Brain } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import AIAnalysisCard from '@/components/AIAnalysisCard';

interface JobOffer {
    id: number;
    title: string;
    company: string;
    description: string;
    location: string | null;
    tags: string[] | null;
    url: string;
    source: string;
    created_at: string;
}

interface JobMatch {
    id: number;
    job_offer_id: number;
    match_score: number | null;
    tags: string[] | null;
    ai_feedback: string[] | null;
    cover_letter: string | null;
    created_at: string;
    job_offer: JobOffer;
}

interface DashboardProps {
    jobMatches: JobMatch[];
    totalMatches: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ jobMatches, totalMatches }: DashboardProps) {
    const { post, processing } = useForm();
    const [selectedJobTags, setSelectedJobTags] = useState<string[]>([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobMatchesState, setJobMatchesState] = useState<JobMatch[]>(jobMatches);

    // Sincronizar el estado local cuando cambien las props de Inertia
    useEffect(() => {
        setJobMatchesState(jobMatches);
    }, [jobMatches]);

    const handleFetchJobs = () => {
        post(route('jobs.fetch-and-match'), {
            onSuccess: () => {
                toast.success('¡Búsqueda de ofertas completada!');
                // Recargar la página para obtener los datos actualizados
                router.reload({ only: ['jobMatches', 'totalMatches'] });
            },
            onError: (errors) => {
                toast.error(errors.message || 'Error al buscar ofertas');
            }
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const openTagsModal = (tags: string[], jobTitle: string) => {
        setSelectedJobTags(tags);
        setSelectedJobTitle(jobTitle);
        setIsModalOpen(true);
    };

    const handleAnalysisComplete = (jobMatchId: number, analysisData: any) => {
        setJobMatchesState(prevMatches =>
            prevMatches.map(match =>
                match.id === jobMatchId
                    ? {
                        ...match,
                        ai_feedback: analysisData.recomendaciones,
                        cover_letter: analysisData.carta,
                        match_score: analysisData.match_score
                    }
                    : match
            )
        );
        toast.success('¡Análisis completado con éxito!');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
                {/* Header con estadísticas */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total de Ofertas
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalMatches}</div>
                            <p className="text-xs text-muted-foreground">
                                Ofertas que coinciden con tu perfil
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ofertas Recientes
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{jobMatches.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Últimas 10 ofertas encontradas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Buscar Nuevas Ofertas
                            </CardTitle>
                            <Search className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={handleFetchJobs}
                                disabled={processing}
                                className="w-full"
                            >
                                {processing ? 'Buscando...' : 'Buscar Ofertas'}
                            </Button>
                            <p className="text-xs text-muted-foreground mt-2">
                                Busca ofertas que coincidan con tu perfil
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista de ofertas */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Ofertas de Trabajo Coincidentes</CardTitle>
                        <CardDescription>
                            Ofertas que coinciden con tu perfil y habilidades
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {jobMatchesState.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="relative min-h-[200px] overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-semibold mb-2">No hay ofertas aún</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Haz clic en "Buscar Ofertas" para encontrar trabajos que coincidan con tu perfil
                                        </p>
                                        <Button
                                            onClick={handleFetchJobs}
                                            disabled={processing}
                                        >
                                            {processing ? 'Buscando...' : 'Buscar Ofertas'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            jobMatchesState.map((match) => (
                                <div key={match.id} className="space-y-4">
                                    <Card className="hover:shadow-md transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <CardTitle className="text-lg">
                                                        {match.job_offer.title}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Building2 className="h-4 w-4" />
                                                        <span>{match.job_offer.company}</span>
                                                        {match.job_offer.location && (
                                                            <>
                                                                <MapPin className="h-4 w-4 ml-2" />
                                                                <span>{match.job_offer.location}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {match.job_offer.source}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                    >
                                                        <a
                                                            href={match.job_offer.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            Ver Oferta
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <Tabs defaultValue="details" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="details">Detalles de la Oferta</TabsTrigger>
                                                    <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
                                                        <Brain className="h-4 w-4" />
                                                        Análisis IA
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value="details" className="mt-4">
                                                    <div className="space-y-4">
                                                        <p className="text-sm text-muted-foreground">
                                                            {truncateText(match.job_offer.description, 300)}
                                                        </p>
                                                        {match.job_offer.tags && match.job_offer.tags.length > 0 && (
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-medium">Habilidades Requeridas:</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {match.job_offer.tags.slice(0, 8).map((tag, index) => (
                                                                        <Badge key={index} variant="outline" className="text-xs">
                                                                            {tag}
                                                                        </Badge>
                                                                    ))}
                                                                    {match.job_offer.tags.length > 8 && (
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                                                            onClick={() => openTagsModal(match.job_offer.tags!, match.job_offer.title)}
                                                                        >
                                                                            +{match.job_offer.tags.length - 8} más
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value="ai-analysis" className="mt-4">
                                                    <AIAnalysisCard
                                                        jobMatch={match}
                                                        onAnalysisComplete={handleAnalysisComplete}
                                                    />
                                                </TabsContent>
                                            </Tabs>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Modal para mostrar todos los tags */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg">
                            Habilidadess - {selectedJobTitle}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-wrap gap-2">
                            {selectedJobTags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        {selectedJobTags.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                No hay habilidades especificadas para esta oferta.
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
