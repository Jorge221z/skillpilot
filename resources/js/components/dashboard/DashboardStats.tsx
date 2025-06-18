import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trophy, Search, Trash2, AlertTriangle } from "lucide-react"
import { useForm } from "@inertiajs/react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DashboardStatsProps {
  totalMatches: number
  processing: boolean
  onFetchJobs: () => void
}

// Componente Card personalizado sin padding excesivo
const SimpleCard = ({ className, children, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-xl shadow-md hover:shadow-lg transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default function DashboardStats({
  totalMatches,
  processing,
  onFetchJobs
}: DashboardStatsProps) {
  const { delete: deleteMethod, processing: clearingOffers } = useForm()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleClearAllOffers = () => {
    if (totalMatches === 0) {
      toast.info("No hay ofertas para eliminar")
      return
    }

    setShowDeleteModal(true)
  }

  const confirmClearOffers = () => {
    deleteMethod(route("dashboard.clear-offers"), {
      onSuccess: () => {
        setShowDeleteModal(false)
        // Los mensajes flash se manejan automáticamente en el dashboard
      },
      onError: (errors) => {
        toast.error(errors.message || "Error al eliminar las ofertas")
        setShowDeleteModal(false)
      },
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 lg:gap-4">
      {/* Total Matches */}
      <SimpleCard className="w-full sm:w-80 lg:w-96 border-l-4 border-l-orange-200">
        <div className="py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-400 rounded-lg">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-orange-400 dark:text-orange-400">
                  {totalMatches}
                </div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Ofertas encontradas</p>
              </div>
            </div>
          </div>
        </div>
      </SimpleCard>

      {/* Search Action */}
      <SimpleCard className="w-full sm:w-80 lg:w-96 border-l-4 border-l-blue-200">
        <div className="py-3 px-4">
          <div className="flex items-center justify-center">
            <Button
              onClick={onFetchJobs}
              disabled={processing || clearingOffers}
              className="w-full h-10 sm:h-12 bg-blue-500 hover:bg-blue-600 text-white text-base sm:text-lg font-semibold hover:cursor-pointer"
            >
              {processing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Buscando...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">Buscar Nuevas Ofertas</span>
                  <span className="sm:hidden">Buscar</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </SimpleCard>

      {/* Clear All Offers Action */}
      {totalMatches > 0 && (
        <SimpleCard className="w-auto">
          <div className="py-3 px-3">
            <div className="flex items-center justify-center relative group">
              <Button
                onClick={handleClearAllOffers}
                disabled={processing || clearingOffers}
                className="h-10 sm:h-12 w-10 sm:w-12 p-0 bg-red-600 hover:bg-red-700 text-white font-semibold hover:cursor-pointer border-0"
                title="Borrar todas las ofertas"
              >
                {clearingOffers ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>

              {/* Tooltip personalizado */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-10">
                Borrar todas las ofertas
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </SimpleCard>
      )}

      {/* Modal de confirmación para borrar ofertas */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400 mt-3 space-y-2">
              <p>
                ¿Estás seguro de que quieres eliminar todas las <strong>{totalMatches}</strong> ofertas?
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                Esta acción no se puede deshacer.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center mt-6">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={clearingOffers}
                className="w-full sm:w-auto hover:cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmClearOffers}
                disabled={clearingOffers}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white hover:cursor-pointer"
              >
                {clearingOffers ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Eliminando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Eliminar todas
                  </div>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
