import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, Search, Building2, MapPin, Calendar, Brain, ChevronLeft, ChevronRight, Sparkles, Trophy, TrendingUp, Star, Clock, Users, ArrowUpRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import AIAnalysisCard from '@/components/AIAnalysisCard';

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
    links: PaginationLinks[];
}

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
    jobMatches: PaginatedData<JobMatch>;
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
    const [jobMatchesState, setJobMatchesState] = useState<JobMatch[]>(jobMatches.data);

    // Sincronizar el estado local cuando cambien las props de Inertia
    useEffect(() => {
        setJobMatchesState(jobMatches.data);
    }, [jobMatches.data]);

    const handleFetchJobs = () => {
        post(route('jobs.fetch-and-match'), {
            onSuccess: () => {
                toast.success('¡Búsqueda de ofertas completada!', {
                    description: 'Hemos encontrado nuevas oportunidades para ti',
                    duration: 4000,
                });
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Hace 1 día';
        if (diffDays < 7) return `Hace ${diffDays} días`;
        if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
        return date.toLocaleDateString('es-ES');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Hero Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                        SkillPilot Dashboard
                                    </h1>
                                    <p className="text-blue-100 text-lg">Descubre oportunidades perfectas para tu carrera</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                                    <Trophy className="h-4 w-4" />
                                    <span>{totalMatches} ofertas encontradas</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                                    <Brain className="h-4 w-4" />
                                    <span>Análisis con IA</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5"></div>
                            <CardHeader className="relative z-10 pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl">
                                        <Building2 className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                                        +12% esta semana
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold text-emerald-700 mb-1">{totalMatches}</div>
                                <p className="text-emerald-600 font-medium">Ofertas Totales</p>
                                <p className="text-sm text-muted-foreground mt-1">Que coinciden con tu perfil</p>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
                            <CardHeader className="relative z-10 pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                        Actualizado
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="text-3xl font-bold text-blue-700 mb-1">{jobMatches.total}</div>
                                <p className="text-blue-600 font-medium">Esta Página</p>
                                <p className="text-sm text-muted-foreground mt-1">Página {jobMatches.current_page} de {jobMatches.last_page}</p>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                            <CardHeader className="relative z-10 pb-2">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-purple-500/10 rounded-2xl">
                                        <Zap className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-3">
                                <Button
                                    onClick={handleFetchJobs}
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    size="lg"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Buscando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Search className="h-4 w-4" />
                                            Buscar Ofertas
                                        </div>
                                    )}
                                </Button>
                                <p className="text-sm text-muted-foreground text-center">
                                    Encuentra nuevas oportunidades
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Job Offers Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Ofertas Destacadas
                                </h2>
                                <p className="text-muted-foreground">Oportunidades que coinciden perfectamente contigo</p>
                            </div>
                            {jobMatches.total > 0 && (
                                <Badge variant="outline" className="text-sm px-4 py-2">
                                    {jobMatches.from}-{jobMatches.to} de {jobMatches.total}
                                </Badge>
                            )}
                        </div>

                        {jobMatchesState.length === 0 ? (
                            <Card className="border-0 shadow-xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900">
                                <CardContent className="p-12">
                                    <div className="text-center space-y-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <Search className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                <Sparkles className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-semibold">¡Tu próxima oportunidad te espera!</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                Haz clic en "Buscar Ofertas" para descubrir trabajos que coincidan perfectamente con tu perfil y habilidades
                                            </p>
                                        </div>
                                        <Button
                                            onClick={handleFetchJobs}
                                            disabled={processing}
                                            size="lg"
                                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            {processing ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Buscando oportunidades...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <Search className="h-5 w-5" />
                                                    Buscar Ofertas Ahora
                                                </div>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-6">
                                {jobMatchesState.map((match, index) => (
                                    <Card key={match.id} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-3 flex-1">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl">
                                                            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <div className="space-y-1 flex-1">
                                                            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                                                                {match.job_offer.title}
                                                            </CardTitle>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Building2 className="h-4 w-4" />
                                                                    <span className="font-medium">{match.job_offer.company}</span>
                                                                </div>
                                                                {match.job_offer.location && (
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="h-4 w-4" />
                                                                        <span>{match.job_offer.location}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-4 w-4" />
                                                                    <span>{formatDate(match.job_offer.created_at)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 dark:from-emerald-900 dark:to-teal-900 dark:text-emerald-400"
                                                    >
                                                        {match.job_offer.source}
                                                    </Badge>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        asChild
                                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300"
                                                    >
                                                        <a
                                                            href={match.job_offer.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <ExternalLink className="h-3 w-3" />
                                                            Ver Oferta
                                                            <ArrowUpRight className="h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Descripción de la oferta */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                                                    Descripción del Puesto
                                                </h4>
                                                <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                        {truncateText(match.job_offer.description, 300)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Habilidades requeridas */}
                                            {match.job_offer.tags && match.job_offer.tags.length > 0 && (
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                        <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                                                        Habilidades Requeridas
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {match.job_offer.tags.slice(0, 8).map((tag, tagIndex) => (
                                                            <Badge
                                                                key={tagIndex}
                                                                variant="outline"
                                                                className="text-xs py-1 px-3 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-blue-700 transition-all duration-300 hover:scale-105 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-400 dark:border-blue-800"
                                                            >
                                                                {tag}
                                                            </Badge>
                                                        ))}
                                                        {match.job_offer.tags.length > 8 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs cursor-pointer bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200 text-purple-700 transition-all duration-300 hover:scale-105 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-400 dark:border-purple-800"
                                                                onClick={() => openTagsModal(match.job_offer.tags!, match.job_offer.title)}
                                                            >
                                                                <Sparkles className="h-3 w-3 mr-1" />
                                                                +{match.job_offer.tags.length - 8} más
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Análisis con IA */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl">
                                                        <Brain className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        Análisis Inteligente con IA
                                                    </h4>
                                                    <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs">
                                                        Powered by AI
                                                    </Badge>
                                                </div>
                                                <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                                                    <AIAnalysisCard
                                                        jobMatch={match}
                                                        onAnalysisComplete={handleAnalysisComplete}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Paginación mejorada */}
                                {jobMatches.last_page > 1 && (
                                    <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm text-muted-foreground">
                                                        Mostrando {jobMatches.from}-{jobMatches.to} de {jobMatches.total} ofertas
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={!jobMatches.prev_page_url}
                                                        asChild={!!jobMatches.prev_page_url}
                                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300"
                                                    >
                                                        {jobMatches.prev_page_url ? (
                                                            <Link href={jobMatches.prev_page_url} className="flex items-center gap-2">
                                                                <ChevronLeft className="h-4 w-4" />
                                                                Anterior
                                                            </Link>
                                                        ) : (
                                                            <span className="flex items-center gap-2 cursor-not-allowed opacity-50">
                                                                <ChevronLeft className="h-4 w-4" />
                                                                Anterior
                                                            </span>
                                                        )}
                                                    </Button>

                                                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg">
                                                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                            Página {jobMatches.current_page} de {jobMatches.last_page}
                                                        </span>
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={!jobMatches.next_page_url}
                                                        asChild={!!jobMatches.next_page_url}
                                                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all duration-300"
                                                    >
                                                        {jobMatches.next_page_url ? (
                                                            <Link href={jobMatches.next_page_url} className="flex items-center gap-2">
                                                                Siguiente
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Link>
                                                        ) : (
                                                            <span className="flex items-center gap-2 cursor-not-allowed opacity-50">
                                                                Siguiente
                                                                <ChevronRight className="h-4 w-4" />
                                                            </span>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal mejorado para mostrar todos los tags */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-4xl border-0 bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-slate-900 shadow-2xl">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-xl">
                                    <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                Habilidades Completas - {selectedJobTitle}
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedJobTags.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Todas las habilidades y tecnologías requeridas para esta posición:
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {selectedJobTags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-sm py-2 px-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200 text-blue-700 transition-all duration-300 hover:scale-105 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-400 dark:border-blue-800"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                        💡 <strong>Tip:</strong> Asegúrate de destacar estas habilidades en tu CV y carta de presentación para aumentar tus posibilidades de éxito.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-full flex items-center justify-center mx-auto">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-muted-foreground">
                                    No hay habilidades específicas listadas para esta oferta.
                                </p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
