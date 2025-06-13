import AppLogoIcon from "@/components/app-logo-icon"
import type { SharedData } from "@/types"
import { Link, usePage } from "@inertiajs/react"
import type { PropsWithChildren } from "react"

interface AuthLayoutProps {
  title?: string
  description?: string
}

// Componente de partículas flotantes distribuidas por todo el espacio
function EnhancedParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Partículas pequeñas */}
      <div className="absolute top-1/6 left-1/5 w-1 h-1 bg-blue-400/30 rounded-full animate-float-slow" />
      <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-orange-400/25 rounded-full animate-float-medium" />
      <div className="absolute top-1/3 left-1/6 w-1 h-1 bg-blue-300/35 rounded-full animate-float-fast" />
      <div className="absolute top-2/5 right-1/6 w-1.5 h-1.5 bg-orange-300/30 rounded-full animate-float-slow" />
      <div className="absolute top-3/5 left-1/3 w-1 h-1 bg-blue-400/30 rounded-full animate-float-medium" />
      <div className="absolute top-4/5 right-1/3 w-1.5 h-1.5 bg-orange-400/25 rounded-full animate-float-slow" />

      {/* Partículas medianas */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 rounded-full animate-float-slow" />
      <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-orange-400/15 rounded-full animate-float-medium" />
      <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-blue-300/25 rounded-full animate-float-fast" />
      <div className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-orange-300/20 rounded-full animate-float-slow" />
      <div className="absolute top-3/4 left-1/3 w-2 h-2 bg-blue-200/30 rounded-full animate-float-medium" />

      {/* Partículas centrales (para llenar el espacio donde estaba la brújula) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400/25 rounded-full animate-float-slow" />
      <div className="absolute top-[45%] left-[55%] w-2.5 h-2.5 bg-orange-400/20 rounded-full animate-float-medium" />
      <div className="absolute top-[55%] left-[45%] w-2 h-2 bg-blue-300/30 rounded-full animate-float-fast" />
      <div className="absolute top-[48%] left-[52%] w-1.5 h-1.5 bg-orange-300/35 rounded-full animate-float-slow" />
      <div className="absolute top-[52%] left-[48%] w-1 h-1 bg-blue-400/40 rounded-full animate-float-medium" />

      {/* Formas geométricas */}
      <div className="absolute top-1/5 right-1/5 w-3 h-3 border border-blue-400/15 rotate-45 animate-float-slow" />
      <div className="absolute top-2/5 left-1/5 w-2.5 h-2.5 border border-orange-400/20 animate-float-medium" />
      <div className="absolute top-3/5 right-1/6 w-2 h-2 border border-blue-300/25 rotate-12 animate-float-fast" />
      <div className="absolute top-4/5 left-1/4 w-3 h-3 border border-orange-300/15 animate-float-slow" />
      <div className="absolute top-[48%] left-[52%] w-4 h-4 border border-blue-400/10 rotate-45 animate-float-medium" />

      {/* Líneas decorativas */}
      <div className="absolute top-1/6 left-1/2 w-12 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-float-horizontal" />
      <div className="absolute top-5/6 right-1/2 w-10 h-px bg-gradient-to-r from-transparent via-orange-400/15 to-transparent animate-float-horizontal-reverse" />
      <div className="absolute top-1/2 left-1/6 w-8 h-px bg-gradient-to-r from-blue-300/20 to-transparent animate-float-horizontal" />
      <div className="absolute top-1/3 right-1/6 w-6 h-px bg-gradient-to-r from-orange-300/25 to-transparent animate-float-horizontal-reverse" />
      <div className="absolute top-2/3 left-1/4 w-10 h-px bg-gradient-to-r from-blue-400/15 to-transparent animate-float-horizontal" />

      {/* Líneas verticales */}
      <div className="absolute top-1/4 left-3/4 w-px h-8 bg-gradient-to-b from-transparent via-blue-400/15 to-transparent animate-float-vertical" />
      <div className="absolute top-3/4 right-3/4 w-px h-6 bg-gradient-to-b from-orange-400/20 via-transparent to-transparent animate-float-vertical-reverse" />
      <div className="absolute top-1/2 left-1/2 w-px h-10 bg-gradient-to-b from-blue-300/10 via-transparent to-transparent animate-float-vertical" />
    </div>
  )
}

export default function AuthSplitLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
  const { name, quote } = usePage<SharedData>().props

  return (
    <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />

        {/* Partículas flotantes mejoradas */}
        <EnhancedParticles />

        {/* Gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-orange-900/3" />

        <Link href={route("home")} className="relative z-20 flex items-center text-xl font-medium">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-800 p-0 shadow-lg shadow-blue-500/20 mr-3">
            <div className="relative h-full w-full">
              <AppLogoIcon className="h-full w-full object-cover rounded-full" />
            </div>
          </div>
          <span className="font-bold text-xl">
            <span className="text-blue-400">Skill</span>
            <span className="text-orange-500">Pilot</span>
          </span>
        </Link>

        {quote && (
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">&ldquo;{quote.message}&rdquo;</p>
              <footer className="text-sm text-neutral-300">{quote.author}</footer>
            </blockquote>
          </div>
        )}
      </div>
      <div className="w-full lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Link href={route("home")} className="relative z-20 flex items-center justify-center lg:hidden">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-800 p-0 shadow-lg shadow-blue-500/20 sm:h-14 sm:w-14">
              <div className="relative h-full w-full">
                <AppLogoIcon className="h-full w-full object-cover rounded-full" />
              </div>
            </div>
            <span className="ml-3 font-bold text-2xl">
              <span className="text-blue-400">Skill</span>
              <span className="text-orange-500">Pilot</span>
            </span>
          </Link>
          <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
            <h1 className="text-xl font-medium">{title}</h1>
            <p className="text-sm text-balance text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
