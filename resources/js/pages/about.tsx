import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ExternalLink,
  Brain,
  Search,
  Target,
  Code,
  Zap,
  Users,
  MessageCircle,
  Github,
  Linkedin,
  Mail,
  Briefcase,
  Lightbulb,
  Rocket,
  Star,
  Globe,
  Database,
  Shield,
  Activity
} from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Sobre el Proyecto",
    href: "/about",
  },
]

const technologies = [
  { name: "Laravel", type: "Backend" },
  { name: "React", type: "Frontend" },
  { name: "TypeScript", type: "Frontend" },
  { name: "Inertia.js", type: "Fullstack" },
  { name: "Tailwind CSS", type: "Styling" },
  { name: "MySQL", type: "Database" },
  { name: "Llama 3.3 Instruct", type: "AI/ML" },
  { name: "Vite", type: "Build Tool" },
]

const features = [
  {
    icon: Search,
    title: "Búsqueda Inteligente",
    description: "Encuentra ofertas de trabajo que se ajusten perfectamente a tu perfil profesional usando algoritmos avanzados."
  },
  {
    icon: Brain,
    title: "Análisis con IA",
    description: "Obtén feedback personalizado sobre tu compatibilidad con cada oferta y mejora tus posibilidades de éxito."
  },
  {
    icon: MessageCircle,
    title: "Chatbot Asistente",
    description: "Consulta dudas sobre ofertas de trabajo, recibe consejos profesionales y obtén ayuda personalizada 24/7."
  },
  {
    icon: Target,
    title: "Matching Preciso",
    description: "Sistema de puntuación que evalúa tu experiencia, habilidades y preferencias contra los requisitos del empleo."
  },
  {
    icon: Zap,
    title: "Automatización",
    description: "Procesa automáticamente tu CV, extrae habilidades y genera cartas de presentación personalizadas."
  },
  {
    icon: Shield,
    title: "Privacidad Segura",
    description: "Tus datos están protegidos con las mejores prácticas de seguridad y privacidad."
  }
]

export default function About() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sobre el Proyecto" />

      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto px-4 py-12 max-w-6xl">

          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="h-23 w-23 rounded-full bg-gradient-to-br from-blue-200 to-blue-800 p-0 shadow-lg shadow-blue-500/20">
                <div className="relative h-full w-full">
                  <img
                    src="/skillpilot-logo.png"
                    alt="SkillPilot Logo"
                    className="h-full w-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-blue-400">Skill</span>
              <span className="text-orange-500">Pilot</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-3xl mx-auto">
              Tu copiloto inteligente para navegar hacia el mundo laboral
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2 text-lg bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
                <Activity className="h-4 w-4 mr-2" />
                Sistema en Desarrollo
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Star className="h-4 w-4 mr-2" />
                Proyecto Personal
              </Badge>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Lightbulb className="h-8 w-8 text-amber-500" />
                  El Problema
                </CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-600 dark:text-neutral-300 space-y-4">
                <p>
                  La búsqueda de empleo puede ser abrumadora y desorganizada. Los candidatos pierden tiempo evaluando ofertas que no se ajustan a su perfil, mientras que las empresas reciben aplicaciones poco relevantes.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Exceso de Plataformas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Proceso manual y tedioso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Dificultad para destacar entre candidatos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Target className="h-8 w-8 text-teal-500" />
                  La Solución
                </CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-600 dark:text-neutral-300 space-y-4">
                <p>
                  SkillPilot utiliza inteligencia artificial para crear un puente inteligente entre candidatos y oportunidades laborales, optimizando el proceso de búsqueda y aplicación.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Matching inteligente basado en IA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Automatización del proceso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
                    <span>Feedback personalizado y actionable</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-neutral-100">
              Características Principales
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600 dark:text-neutral-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-neutral-100">
              Tecnologías Utilizadas
            </h2>
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {technologies.map((tech, index) => (
                    <div key={index} className="text-center p-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {tech.name}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {tech.type}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* About Developer */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900 dark:text-neutral-100">
              Sobre el Desarrollador
            </h2>
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Users className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                      Jorge Muñoz
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                      Desarrollador Full Stack apasionado por crear soluciones tecnológicas que impacten positivamente en la vida de las personas.
                      SkillPilot nace de la experiencia personal en búsqueda de empleo y el deseo de ayudar a otros profesionales a encontrar
                      oportunidades que realmente se ajusten a sus habilidades y aspiraciones.
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <Button
                        asChild
                        variant="outline"
                        className="border-teal-200 hover:bg-teal-50 dark:border-teal-800 dark:hover:bg-teal-900/20"
                      >
                        <a
                          href="https://jorgemunoz.pro"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Globe className="h-4 w-4" />
                          Portfolio
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-neutral-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
                      >
                        <a
                          href="https://github.com/Jorge221z"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          GitHub
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                      >
                        <a
                          href="https://www.linkedin.com/in/jorge-muñoz-castillo"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Status */}
          <div className="text-center">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 backdrop-blur">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
                  Estado del Proyecto
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 max-w-2xl mx-auto">
                  SkillPilot está en fase de MVP. Estoy abierto a continuar desarrollando nuevas funcionalidades y mejoras basadas en feedback de usuarios.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Badge className="px-4 py-2 bg-teal-500 hover:bg-teal-600">
                    <Database className="h-4 w-4 mr-2" />
                    MVP Completo
                  </Badge>
                  <Badge className="px-4 py-2 bg-blue-500 hover:bg-blue-600">
                    <Code className="h-4 w-4 mr-2" />
                    Autenticación Implementada
                  </Badge>
                  <Badge className="px-4 py-2 bg-purple-500 hover:bg-purple-600">
                    <Brain className="h-4 w-4 mr-2" />
                    IA Integrada en el flujo de trabajo
                  </Badge>
                </div>
                <div className="flex justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <a
                      href="https://github.com/Jorge221z/skillpilot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <Github className="h-5 w-5" />
                      Ver Código Fuente
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Licencia del Proyecto */}
          <div className="mt-16">
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-amber-500" />
                  <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                    Licencia del Proyecto
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Este proyecto está protegido bajo una licencia personalizada con derechos de autor reservados
                  a Jorge Muñoz Castillo (Jorge221z). El software se proporciona exclusivamente para fines
                  educativos y de referencia.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Permisos */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Permisos
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Uso para fines educativos y de referencia</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Modificación con consentimiento explícito por escrito</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Atribución clara al autor original requerida</span>
                      </li>
                    </ul>
                  </div>

                  {/* Prohibiciones */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Prohibiciones
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Uso comercial no autorizado</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>Copia, modificación o distribución sin permiso</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>No se otorgan derechos de código abierto</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 mt-6">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Para solicitudes de permisos o consultas sobre la licencia:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        Contacta: <span className="font-mono">jorgemunozcast12@gmail.com</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    © {new Date().getFullYear()} Jorge Muñoz Castillo (Jorge221z). Todos los derechos reservados.
                  </p>
                  <div className="mt-3">
                    <a
                      href="https://github.com/Jorge221z/skillpilot?tab=License-1-ov-file#readme"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 underline font-medium text-sm"
                    >
                      Ver licencia completa en GitHub
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
