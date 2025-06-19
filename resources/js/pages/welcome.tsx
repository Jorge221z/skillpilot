"use client"

import type { SharedData } from "@/types"
import { Head, Link, usePage } from "@inertiajs/react"
import { User } from "lucide-react"
import { useEffect } from "react"

export default function Welcome() {
  const { auth } = usePage<SharedData>().props

  // Redirigir automáticamente si el usuario está autenticado
  useEffect(() => {
    if (auth.user) {
      window.location.href = route("dashboard")
    }
  }, [])

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SkillPilot",
    description:
      "Plataforma inteligente que busca ofertas de empleo adaptadas a tus preferencias y te ayuda a optimizar tu candidatura mediante IA",
    url: "https://skillpilot.es",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://skillpilot.es/dashboard?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    sameAs: [],
    publisher: {
      "@type": "Organization",
      name: "SkillPilot",
      description: "Plataforma de búsqueda de empleo con inteligencia artificial",
    },
  }

  return (
    <>
      <Head title="Búsqueda de Empleo con IA">
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <style>{`
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease-in-out infinite;
}
                `}</style>
      </Head>
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        {/* Header con navegación */}
        <header className="container mx-auto w-full max-w-7xl px-4 sm:px-6 py-4 sm:py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Logo */}
              <div className="h-10 w-10 sm:h-13 sm:w-13 rounded-full bg-gradient-to-br from-blue-200 to-blue-800 p-0 shadow-lg shadow-blue-500/20">
                <div className="relative h-full w-full">
                  <img
                    src="/skillpilot-logo.png"
                    alt="SkillPilot Logo"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              </div>
              <span className="text-lg sm:text-2xl font-bold">
                <span className="text-blue-400">Skill</span>
                <span className="text-orange-500">Pilot</span>
              </span>
            </div>

            {/* Botones de navegación */}
            <div className="flex items-center gap-2 sm:gap-4">
              {auth.user ? (
                <Link
                  href={route("dashboard")}
                  className="inline-block rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={route("login")}
                    className="inline-block rounded-md border border-blue-500 px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/10"
                  >
                    <span className="hidden sm:inline">Iniciar Sesión</span>
                    <span className="sm:hidden">Login</span>
                  </Link>
                  <Link
                    href={route("register")}
                    className="inline-block rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-3 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40"
                  >
                    <span className="hidden sm:inline">Registrarse</span>
                    <span className="sm:hidden">Registro</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* Contenido principal */}
        <div className="flex w-full flex-1 items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-7xl space-y-8 sm:space-y-12">
            {/* Título principal - Ancho completo */}
            <div className="text-center pb-12 sm:pb-25 pt-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 animate-gradient-x font-extrabold">
                  Automatiza
                </span>{" "}
                tu búsqueda de empleo
              </h1>
              <div className="mt-3 text-lg sm:text-xl md:text-2xl text-slate-300 font-medium">
                con inteligencia artificial avanzada
              </div>
            </div>

            {/* Contenido secundario - Grid */}
            <div className="flex flex-col-reverse gap-8 sm:gap-12 lg:flex-row">
              {/* Columna izquierda - Descripción y botones */}
              <div className="flex-1 space-y-4 sm:space-y-6">
                <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-300 px-2">
                  SkillPilot utiliza IA de última generación para conectarte con ofertas que encajan perfectamente con
                  tu perfil y te ayuda a optimizar cada candidatura para maximizar tus posibilidades de éxito.
                </p>
                <div className="flex flex-col gap-3 sm:gap-4 pt-2 sm:pt-4 sm:flex-row px-2">
                  <Link
                    href={route("register")}
                    className="inline-block rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40 hover:scale-105 transform"
                  >
                    Comenzar Ahora
                  </Link>
                  <a
                    href="#features"
                    className="inline-block rounded-md border border-slate-700 px-6 py-3 text-center text-slate-300 transition-all hover:bg-slate-800 hover:border-orange-500/50"
                  >
                    ¿Cómo funciona?
                  </a>
                </div>
              </div>

              {/* Columna derecha - Ilustración */}
              <div className="flex-1 relative flex flex-col justify-center">
                <div className="absolute -z-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/30 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute -z-10 w-48 h-48 sm:w-72 sm:h-72 bg-orange-500/20 rounded-full blur-3xl top-1/3 left-1/3"></div>

                {/* Formas decorativas */}
                <div className="relative mx-4 sm:mx-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-orange-500/20 rounded-lg blur-xl"></div>
                  <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 sm:p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <svg
                          className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white">Potencia tu carrera profesional</h3>
                    </div>
                    <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">
                      SkillPilot analiza miles de ofertas de trabajo en tiempo real para encontrar las oportunidades que
                      mejor se adaptan a tu perfil y aspiraciones profesionales.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-2 sm:px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">
                        Optimización de CV
                      </span>
                      <span className="inline-block px-2 sm:px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded-full">
                        Carta personalizada
                      </span>
                      <span className="inline-block px-2 sm:px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                        Múltiples fuentes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Características */}
        <section id="features" className="container mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs sm:text-sm text-blue-400 mb-3 sm:mb-4">
              Características
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold px-2">Cómo funciona SkillPilot</h2>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-slate-300 text-sm sm:text-base px-4">
              Nuestra plataforma combina inteligencia artificial con búsqueda de empleo para darte ventaja competitiva
              en tu carrera profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-orange-500/50 transition-all hover:transform hover:scale-105">
              <div className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mb-3 sm:mb-4">
                <User className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Completa tu perfil</h3>
              <p className="text-slate-300 text-sm sm:text-base">
                Especifica el puesto que buscas, añade tus habilidades y tecnologías, y sube tu currículum vitae para un
                análisis completo.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-orange-500/50 transition-all hover:transform hover:scale-105">
              <div className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Búsqueda inteligente</h3>
              <p className="text-slate-300 text-sm sm:text-base">
                Recopilamos ofertas de múltiples fuentes y utilizamos IA para mostrarte solo las que tienen mayor
                compatibilidad con tu perfil.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 hover:border-orange-500/50 transition-all hover:transform hover:scale-105 sm:col-span-2 md:col-span-1">
              <div className="h-10 w-10 sm:h-12 sm:w-12 text-orange-500 mb-3 sm:mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Optimización con IA</h3>
              <p className="text-slate-300 text-sm sm:text-base">
                Recibe recomendaciones personalizadas para mejorar tu CV y genera cartas de presentación únicas para
                cada oportunidad.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="container mx-auto w-full max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 sm:p-8 md:p-12 relative overflow-hidden mx-2 sm:mx-0">
            <div className="absolute -z-10 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl top-0 right-0"></div>
            <div className="absolute -z-10 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/10 rounded-full blur-3xl bottom-0 left-0"></div>

            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-2">
                ¿Listo para encontrar el trabajo de tus sueños?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-2">
                Regístrate en segundos y comienza a recibir ofertas personalizadas que se ajusten perfectamente a tu
                perfil profesional y aspiraciones.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href={route("register")}
                  className="inline-block rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40 hover:scale-105 transform"
                >
                  Crear Cuenta Gratis
                </Link>
                <Link
                  href={route("login")}
                  className="inline-block rounded-md border border-blue-500 px-6 py-3 text-center text-blue-400 transition-all hover:bg-blue-500/10 hover:border-blue-400"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 py-6 sm:py-8">
          <div className="container mx-auto w-full max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center gap-2 mb-4 md:mb-0">
                <span className="text-lg sm:text-xl font-bold">
                  <span className="text-blue-400">Skill</span>
                  <span className="text-orange-500">Pilot</span>
                </span>
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                © {new Date().getFullYear()} SkillPilot. Todos los derechos reservados.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
