import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Building2,
  MapPin,
  Brain,
  Clock,
  Eye,
} from "lucide-react"
import AIAnalysisCard from "@/components/AIAnalysisCard"
import { useState } from "react"
import JobDescriptionModal from "./JobDescriptionModal"

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

interface JobCardProps {
  match: JobMatch
  onAnalysisComplete: (jobMatchId: number, analysisData: any) => void
  onTagsModalOpen: (tags: string[], jobTitle: string) => void
}

export default function JobCard({
  match,
  onAnalysisComplete,
  onTagsModalOpen
}: JobCardProps) {
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
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

  return (
    <Card className="hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 shadow-md overflow-hidden pt-0 mt-0">
      <CardHeader className="p-0 bg-gray-5 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-4 sm:p-6 pb-3 sm:pb-4 gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                  {match.job_offer.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium truncate">{match.job_offer.company}</span>
                  {match.job_offer.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{match.job_offer.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 flex-shrink-0" />
                    <span>{formatDate(match.job_offer.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col lg:flex-row gap-2 sm:ml-4">
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs whitespace-nowrap">
              {match.job_offer.source}
            </Badge>
            <Button size="sm" variant="outline" asChild className="flex-shrink-0">
              <a
                href={match.job_offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                <span className="hidden sm:inline">Ver Oferta</span>
                <span className="sm:hidden">Ver</span>
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {/* Job Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Descripción</h4>
            {match.job_offer.description.length > 300 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDescriptionModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs h-auto p-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver completa
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-lg border border-gray-300 dark:border-gray-600">
            {truncateText(match.job_offer.description, 300)}
            {match.job_offer.description.length > 300 && (
              <button
                onClick={() => setIsDescriptionModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium ml-1 text-xs underline"
              >
                leer más
              </button>
            )}
          </p>
        </div>

        {/* Skills */}
        {match.job_offer.tags && match.job_offer.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Habilidades</h4>
            <div className="flex flex-wrap gap-2">
              {match.job_offer.tags.slice(0, 6).map((tag, tagIndex) => (
                <Badge
                  key={tagIndex}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 text-xs"
                >
                  {tag}
                </Badge>
              ))}
              {match.job_offer.tags.length > 6 && (
                <Badge
                  variant="outline"
                  className="cursor-pointer bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 text-xs"
                  onClick={() => onTagsModalOpen(match.job_offer.tags!, match.job_offer.title)}
                >
                  +{match.job_offer.tags.length - 6} más
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* AI Analysis */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-500" />
              Análisis con IA
            </h4>
            {match.match_score && (
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700 text-xs w-fit">
                {match.match_score}% compatibilidad
              </Badge>
            )}
          </div>

          {/* Show analysis if available, otherwise show compact call-to-action */}
          {(match.ai_feedback && match.ai_feedback.length > 0) || match.cover_letter ? (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-300 dark:border-purple-700 p-3 sm:p-4 shadow-sm">
              <AIAnalysisCard jobMatch={match} onAnalysisComplete={onAnalysisComplete} />
            </div>
          ) : (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-3 sm:p-4 border border-purple-300 dark:border-purple-700 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-800/50 rounded-lg">
                    <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
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
                  <AIAnalysisCard jobMatch={match} onAnalysisComplete={onAnalysisComplete} />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Modal para descripción completa */}
      <JobDescriptionModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        jobOffer={match.job_offer}
      />
    </Card>
  )
}
