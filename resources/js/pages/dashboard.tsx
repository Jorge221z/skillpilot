import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, useForm, router, usePage } from "@inertiajs/react"
import { Badge } from "@/components/ui/badge"
import { Briefcase } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect, useCallback, useMemo } from "react"
import PaginationControls from "@/components/dashboard/PaginationControls"
import DashboardStats from "@/components/dashboard/DashboardStats"
import JobCard from "@/components/dashboard/JobCard"
import TagsModal from "@/components/dashboard/TagsModal"
import EmptyState from "@/components/dashboard/EmptyState"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, User } from "lucide-react"

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
  const [showNoJobsModal, setShowNoJobsModal] = useState(false)

  // Memoizar flash messages para evitar re-renders innecesarios
  const flashMessages = useMemo(() => props.flash, [props.flash])

  // Handle flash messages con dependencias optimizadas
  useEffect(() => {
    if (!flashMessages) return

    if (flashMessages.success) {
      toast.success(flashMessages.success, { duration: 4000 })
    }
    if (flashMessages.error) {
      toast.error(flashMessages.error, { duration: 5000 })
    }
    if (flashMessages.warning) {
      toast.warning(flashMessages.warning, { duration: 4000 })

      // Verificar si es un mensaje de "no se encontraron ofertas" y no hay ofertas existentes
      if (flashMessages.warning.includes('No se encontraron ofertas') && jobMatches.total === 0) {
        // Mostrar el modal después de un breve delay para que se vea el toast primero
        setTimeout(() => {
          setShowNoJobsModal(true)
        }, 500)
      }
    }
    if (flashMessages.info) {
      toast.info(flashMessages.info, { duration: 4000 })
    }
  }, [flashMessages, jobMatches.total])

  const handleFetchJobs = useCallback(() => {
    post(route("jobs.fetch-and-match"), {
      onSuccess: () => {
        router.reload({ only: ["jobMatches", "totalMatches"] })
      },
      onError: (errors) => {
        toast.error(errors.message || "Error al buscar ofertas")
      },
    })
  }, [post])

  const openTagsModal = useCallback((tags: string[], jobTitle: string) => {
    setSelectedJobTags(tags)
    setSelectedJobTitle(jobTitle)
    setIsModalOpen(true)
  }, [])

  const handleAnalysisComplete = useCallback((jobMatchId: number, analysisData: any) => {
    // Usar router.reload en lugar de estado local para mantener sincronización
    router.reload({ only: ["jobMatches"] })
    toast.success("¡Análisis completado con éxito!")
  }, [])

  const handleRedirectToProfile = useCallback(() => {
    setShowNoJobsModal(false)
    router.visit(route("profile"))
  }, [])

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
                Encuentra oportunidades que coincidan<br></br> con tu perfil profesional
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

            {jobMatches.data.length === 0 ? (
              <EmptyState processing={processing} onFetchJobs={handleFetchJobs} />
            ) : (
              <div className="space-y-4">
                {jobMatches.data.map((match: JobMatch) => (
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

      {/* No Jobs Found Modal */}
      <Dialog open={showNoJobsModal} onOpenChange={setShowNoJobsModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20">
              <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              No encontramos ofertas para ti
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400 mt-3 space-y-2">
              <p>
                No hemos encontrado ninguna oferta de trabajo que coincida con tu perfil profesional actual.
              </p>
              <p className="text-sm">
                Para mejorar tus resultados, te recomendamos actualizar tu perfil profesional
                con más detalles sobre tus habilidades, tecnologías y preferencias laborales.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowNoJobsModal(false)}
                className="w-full sm:w-auto cursor-pointer"
              >
                Cerrar
              </Button>
              <Button
                onClick={handleRedirectToProfile}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                <User className="h-4 w-4 mr-2" />
                Actualizar Perfil
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
