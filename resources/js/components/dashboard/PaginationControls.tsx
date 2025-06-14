import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@inertiajs/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

interface PaginationControlsProps {
  paginatedData: PaginatedData<any>
  compact?: boolean
}

export default function PaginationControls({
  paginatedData,
  compact = false
}: PaginationControlsProps) {
  if (paginatedData.last_page <= 1) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!paginatedData.prev_page_url}
          asChild={!!paginatedData.prev_page_url}
        >
          {paginatedData.prev_page_url ? (
            <Link href={paginatedData.prev_page_url}>
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded text-xs font-medium text-indigo-700 dark:text-indigo-300">
          {paginatedData.current_page}/{paginatedData.last_page}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={!paginatedData.next_page_url}
          asChild={!!paginatedData.next_page_url}
        >
          {paginatedData.next_page_url ? (
            <Link href={paginatedData.next_page_url}>
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
            Mostrando {paginatedData.from}-{paginatedData.to} de {paginatedData.total} ofertas
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!paginatedData.prev_page_url}
              asChild={!!paginatedData.prev_page_url}
            >
              {paginatedData.prev_page_url ? (
                <Link href={paginatedData.prev_page_url} className="flex items-center gap-1">
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
              {paginatedData.current_page} / {paginatedData.last_page}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={!paginatedData.next_page_url}
              asChild={!!paginatedData.next_page_url}
            >
              {paginatedData.next_page_url ? (
                <Link href={paginatedData.next_page_url} className="flex items-center gap-1">
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
