import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, useForm, router, usePage } from "@inertiajs/react"
import { Badge } from "@/components/ui/badge"
import { Briefcase } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import PaginationControls from "@/components/dashboard/PaginationControls"
import DashboardStats from "@/components/dashboard/DashboardStats"
import JobCard from "@/components/dashboard/JobCard"
import TagsModal from "@/components/dashboard/TagsModal"
import EmptyState from "@/components/dashboard/EmptyState"

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

interface FlashMessages {
  success?: string
  error?: string
  warning?: string
  info?: string
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
]

export default function Dashboard({ jobMatches, totalMatches }: DashboardProps) {
  const { post, processing } = useForm()
  const { props } = usePage<{ flash?: FlashMessages }>()
  const [selectedJobTags, setSelectedJobTags] = useState<string[]>([])
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [jobMatchesState, setJobMatchesState] = useState<JobMatch[]>(jobMatches.data)

  useEffect(() => {
    setJobMatchesState(jobMatches.data)
  }, [jobMatches.data])

  // Handle flash messages
  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success, {
        duration: 4000,
      })
    }
    if (props.flash?.error) {
      toast.error(props.flash.error, {
        duration: 5000,
      })
    }
    if (props.flash?.warning) {
      toast.warning(props.flash.warning, {
        duration: 4000,
      })
    }
    if (props.flash?.info) {
      toast.info(props.flash.info, {
        duration: 4000,
      })
    }
  }, [props.flash])

  const handleFetchJobs = () => {
    post(route("jobs.fetch-and-match"), {
      onSuccess: () => {
        // No mostramos toast aquí porque los mensajes flash se manejan automáticamente
        // Si hay ofertas, se mostrará un mensaje de éxito via flash
        // Si el perfil está incompleto, se redirigirá a /profile con mensaje de error
        router.reload({ only: ["jobMatches", "totalMatches"] })
      },
      onError: (errors) => {
        toast.error(errors.message || "Error al buscar ofertas")
      },
    })
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ofertas" />
      <div className="min-h-screen bg-gray-100 dark:bg-neutral-800">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
          {/* Header with Stats Cards */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="border-l-4 border-l-indigo-500 pl-4 sm:pl-6 py-2 sm:py-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Ofertas</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                Encuentra oportunidades que coincidan con tu perfil profesional
              </p>
            </div>

            {/* Stats Cards */}
            <DashboardStats
              totalMatches={totalMatches}
              processing={processing}
              onFetchJobs={handleFetchJobs}
            />
          </div>

          {/* Job Offers Section */}
          <div className="space-y-4 sm:space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                  Ofertas de Trabajo
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Oportunidades que coinciden contigo</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {jobMatches.total > 0 && (
                  <Badge
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300 text-xs sm:text-sm w-fit"
                  >
                    {jobMatches.from}-{jobMatches.to} de {jobMatches.total}
                  </Badge>
                )}
                <PaginationControls paginatedData={jobMatches} compact={true} />
              </div>
            </div>

            {jobMatchesState.length === 0 ? (
              <EmptyState processing={processing} onFetchJobs={handleFetchJobs} />
            ) : (
              <div className="space-y-4">
                {jobMatchesState.map((match) => (
                  <JobCard
                    key={match.id}
                    match={match}
                    onAnalysisComplete={handleAnalysisComplete}
                    onTagsModalOpen={openTagsModal}
                  />
                ))}

                {/* Pagination */}
                <PaginationControls paginatedData={jobMatches} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags Modal */}
      <TagsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tags={selectedJobTags}
        jobTitle={selectedJobTitle}
      />
    </AppLayout>
  )
}
