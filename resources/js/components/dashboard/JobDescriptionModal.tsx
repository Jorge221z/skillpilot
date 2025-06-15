import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  Calendar,
  Globe,
} from "lucide-react"

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

interface JobDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  jobOffer: JobOffer
}

export default function JobDescriptionModal({
  isOpen,
  onClose,
  jobOffer
}: JobDescriptionModalProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDescription = (description: string) => {
    // Convertir saltos de línea en párrafos
    return description.split('\n').filter(line => line.trim()).map((paragraph, index) => (
      <p key={index} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        {paragraph.trim()}
      </p>
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {jobOffer.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="font-medium">{jobOffer.company}</span>
                </div>
                {jobOffer.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{jobOffer.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(jobOffer.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                    {jobOffer.source}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Descripción completa de la oferta de trabajo
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-6">
            {/* Descripción completa */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Descripción del puesto
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {formatDescription(jobOffer.description)}
                </div>
              </div>
            </div>

            {/* Habilidades requeridas */}
            {jobOffer.tags && jobOffer.tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Habilidades requeridas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobOffer.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                  Información de la oferta
                </span>
              </div>
              <div className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
                <p>• Publicada el {formatDate(jobOffer.created_at)}</p>
                <p>• Fuente: {jobOffer.source}</p>
                {jobOffer.location && <p>• Ubicación: {jobOffer.location}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            asChild
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <a
              href={jobOffer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Ver oferta original
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 sm:flex-none"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
