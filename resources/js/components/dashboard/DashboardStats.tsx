import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Search } from "lucide-react"

interface DashboardStatsProps {
  totalMatches: number
  processing: boolean
  onFetchJobs: () => void
}

export default function DashboardStats({
  totalMatches,
  processing,
  onFetchJobs
}: DashboardStatsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 lg:gap-8">
      {/* Total Matches */}
      <Card className="w-full sm:w-80 lg:w-96 border-l-4 border-l-emerald-500 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-400 rounded-lg">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-orange-400 dark:text-orange-400">
                  {totalMatches}
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Ofertas encontradas</p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search Action */}
      <Card className="w-full sm:w-80 lg:w-96 border-l-4 border-l-violet-500 shadow-md hover:shadow-lg transition-shadow bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-center">
            <Button
              onClick={onFetchJobs}
              disabled={processing}
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
        </CardHeader>
      </Card>
    </div>
  )
}
