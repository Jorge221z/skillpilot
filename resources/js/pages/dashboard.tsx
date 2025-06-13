"use client"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, useForm, router, Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ExternalLink,
  Search,
  Building2,
  MapPin,
  Brain,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Star,
  Clock,
  Activity,
  Briefcase,
} from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import AIAnalysisCard from "@/components/AIAnalysisCard"

interface PaginationLinks {
  url: string | null
  label: string
  active: boolean
}

interface PaginatedData<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
  prev_page_url: string | null
  next_page_url: string | null
  links: PaginationLinks[]
}

interface JobOffer {
  id: number
  title: string
  company: string
  description: string
  location: string | null
  tags: string[] | null
  url: string
  source: string
  created_at: string
}

interface JobMatch {
  id: number
  job_offer_id: number
  match_score: number | null
  tags: string[] | null
  ai_feedback: string[] | null
  cover_letter: string | null
  created_at: string
  job_offer: JobOffer
}

interface DashboardProps {
  jobMatches: PaginatedData<JobMatch>
  totalMatches: number
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
]

export default function Dashboard({ jobMatches, totalMatches }: DashboardProps) {
  const { post, processing } = useForm()
  const [selectedJobTags, setSelectedJobTags] = useState<string[]>([])
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jobMatchesState, setJobMatchesState] = useState<JobMatch[]>(jobMatches.data)

  useEffect(() => {
    setJobMatchesState(jobMatches.data)
  }, [jobMatches.data])

  const handleFetchJobs = () => {
    post(route("jobs.fetch-and-match"), {
      onSuccess: () => {
        toast.success("¡Búsqueda de ofertas completada!", {
          description: "Hemos encontrado nuevas oportunidades para ti",
          duration: 4000,
        })
        router.reload({ only: ["jobMatches", "totalMatches"] })
      },
      onError: (errors) => {
        toast.error(errors.message || "Error al buscar ofertas")
      },
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const openTagsModal = (tags: string[], jobTitle: string) => {
    setSelectedJobTags(tags)
    setSelectedJobTitle(jobTitle)
    setIsModalOpen(true)
  }

  const handleAnalysisComplete = (jobMatchId: number, analysisData: any) => {
    setJobMatchesState((prevMatches) =>
      prevMatches.map((match) =>
        match.id === jobMatchId
          ? {
              ...match,
              ai_feedback: analysisData.recomendaciones,
              cover_letter: analysisData.carta,
              match_score: analysisData.match_score,
            }
          : match,
      ),
    )
    toast.success("¡Análisis completado con éxito!")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Hace 1 día"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
    return date.toLocaleDateString("es-ES")
  }

  // Count offers with recent activity (last 7 days)
  const getRecentOffersCount = () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return jobMatchesState.filter(match =>
      new Date(match.job_offer.created_at) >= sevenDaysAgo
    ).length
  }

  // Pagination component
  const PaginationControls = ({ compact = false }: { compact?: boolean }) => {
    if (jobMatches.last_page <= 1) return null

    if (compact) {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!jobMatches.prev_page_url}
            asChild={!!jobMatches.prev_page_url}
          >
            {jobMatches.prev_page_url ? (
              <Link href={jobMatches.prev_page_url}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>

          <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded text-xs font-medium text-indigo-700 dark:text-indigo-300">
            {jobMatches.current_page}/{jobMatches.last_page}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={!jobMatches.next_page_url}
            asChild={!!jobMatches.next_page_url}
          >
            {jobMatches.next_page_url ? (
              <Link href={jobMatches.next_page_url}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      )
    }

    return (
      <Card className="bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {jobMatches.from}-{jobMatches.to} de {jobMatches.total} ofertas
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!jobMatches.prev_page_url}
                asChild={!!jobMatches.prev_page_url}
              >
                {jobMatches.prev_page_url ? (
                  <Link href={jobMatches.prev_page_url} className="flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Link>
                ) : (
                  <span className="flex items-center gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </span>
                )}
              </Button>

              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded text-sm font-medium text-indigo-700 dark:text-indigo-300">
                {jobMatches.current_page} / {jobMatches.last_page}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={!jobMatches.next_page_url}
                asChild={!!jobMatches.next_page_url}
              >
                {jobMatches.next_page_url ? (
                  <Link href={jobMatches.next_page_url} className="flex items-center gap-1">
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1">
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="min-h-screen bg-gray-100 dark:bg-neutral-950">
        <div className="container mx-auto px-8 md:px-12 lg:px-16 xl:px-20 py-8 space-y-8">
          {/* Header with Stats Cards */}
          <div className="flex items-center justify-between">
            <div className="border-l-4 border-l-indigo-500 pl-6 py-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ofertas</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Encuentra oportunidades que coincidan con tu perfil profesional
              </p>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-8">
              {/* Total Matches */}
              <Card className="w-96 border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-400 rounded-lg">
                        <Trophy className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-orange-400 dark:text-orange-400">
                          {totalMatches}
                        </CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Ofertas encontradas</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Search Action */}
              <Card className="w-96 border-l-4 border-l-violet-500 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-center">
                  <Button
                    onClick={handleFetchJobs}
                    disabled={processing}
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold hover:cursor-pointer"
                  >
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Buscando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Buscar Nuevas Ofertas
                      </div>
                    )}
                  </Button>
                </div>
              </CardHeader>
            </Card>
            </div>
          </div>

          {/* Job Offers Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-500" />
                  Ofertas de Trabajo
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Oportunidades que coinciden contigo</p>
              </div>
              <div className="flex items-center gap-4">
                {jobMatches.total > 0 && (
                  <Badge
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300"
                  >
                    {jobMatches.from}-{jobMatches.to} de {jobMatches.total}
                  </Badge>
                )}
                <PaginationControls compact={true} />
              </div>
            </div>

            {jobMatchesState.length === 0 ? (
              <Card className="text-center py-12 bg-white dark:bg-gray-800/30 border border-gray-300 dark:border-gray-600 shadow-sm">
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        No hay ofertas disponibles
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Haz clic en "Buscar Nuevas Ofertas" para encontrar oportunidades
                      </p>
                    </div>
                    <Button
                      onClick={handleFetchJobs}
                      disabled={processing}
                      className="bg-indigo-500 hover:bg-indigo-600 text-white"
                    >
                      {processing ? "Buscando..." : "Buscar Ofertas"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobMatchesState.map((match) => (
                  <Card key={match.id} className="hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 shadow-md overflow-hidden pt-0 mt-0">
                    <CardHeader className="p-0 bg-gray-5 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-start p-6 pb-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                              <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="space-y-1 flex-1">
                              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                {match.job_offer.title}
                              </CardTitle>
                              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-medium">{match.job_offer.company}</span>
                                {match.job_offer.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>{match.job_offer.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDate(match.job_offer.created_at)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            {match.job_offer.source}
                          </Badge>
                          <Button size="sm" variant="outline" asChild>
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
                    <CardContent className="space-y-4">
                      {/* Job Description */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Descripción</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                          {truncateText(match.job_offer.description, 300)}
                        </p>
                      </div>

                      {/* Skills */}
                      {match.job_offer.tags && match.job_offer.tags.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Habilidades</h4>
                          <div className="flex flex-wrap gap-2">
                            {match.job_offer.tags.slice(0, 8).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {match.job_offer.tags.length > 8 && (
                              <Badge
                                variant="outline"
                                className="cursor-pointer bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700"
                                onClick={() => openTagsModal(match.job_offer.tags!, match.job_offer.title)}
                              >
                                +{match.job_offer.tags.length - 8} más
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {/* AI Analysis */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-500" />
                            Análisis con IA
                          </h4>
                          {match.match_score && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700">
                              {match.match_score}% compatibilidad
                            </Badge>
                          )}
                        </div>

                        {/* Show analysis if available, otherwise show compact call-to-action */}
                        {(match.ai_feedback && match.ai_feedback.length > 0) || match.cover_letter ? (
                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-300 dark:border-purple-700 p-4 shadow-sm">
                            <AIAnalysisCard jobMatch={match} onAnalysisComplete={handleAnalysisComplete} />
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-purple-300 dark:border-purple-700 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                                  <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Análisis pendiente
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Obtén recomendaciones y carta personalizada
                                  </p>
                                </div>
                              </div>
                              <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-purple-300 dark:border-purple-600 shadow-sm">
                                <AIAnalysisCard jobMatch={match} onAnalysisComplete={handleAnalysisComplete} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                <PaginationControls />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-indigo-500" />
              Todas las habilidades - {selectedJobTitle}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedJobTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedJobTags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No hay habilidades específicas listadas para esta oferta.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  )
}
