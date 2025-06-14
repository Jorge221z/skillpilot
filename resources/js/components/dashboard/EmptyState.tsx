import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface EmptyStateProps {
  processing: boolean
  onFetchJobs: () => void
}

export default function EmptyState({ processing, onFetchJobs }: EmptyStateProps) {
  return (
    <Card className="text-center py-8 sm:py-12 bg-white dark:bg-gray-800/30 border border-gray-300 dark:border-gray-600 shadow-sm">
      <CardContent>
        <div className="space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
            <Search className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              No hay ofertas disponibles
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
              Haz clic en "Buscar Nuevas Ofertas" para encontrar oportunidades
            </p>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
              Asegurate de tener tu perfil completo y actualizado para obtener mejores resultados
            </p>
          </div>
          <Button
            onClick={onFetchJobs}
            disabled={processing}
            className="bg-indigo-500 hover:bg-indigo-600 text-white"
          >
            {processing ? "Buscando..." : "Buscar Ofertas"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
