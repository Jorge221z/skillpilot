import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface TagsModalProps {
  isOpen: boolean
  onClose: () => void
  tags: string[]
  jobTitle: string
}

export default function TagsModal({
  isOpen,
  onClose,
  tags,
  jobTitle
}: TagsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-3xl mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
            <span className="truncate">Todas las habilidades - {jobTitle}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700 text-xs sm:text-sm"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
              No hay habilidades específicas listadas para esta oferta.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
