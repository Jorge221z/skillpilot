"use client"

import type React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import { FileText, Shield, Eye, UserCheck, AlertTriangle, Scale } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Términos y Condiciones",
    href: "/terms-and-conditions",
  },
]

export default function TermsAndConditions() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Términos y Condiciones" />
      <div className="min-h-screen bg-gray-100 dark:bg-neutral-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 border-b-4 border-b-teal-500 pb-4">
              <Scale className="h-8 w-8 text-teal-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Términos y Condiciones</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Última actualización: {new Date().toLocaleDateString("es-ES")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {/* Introducción */}
            <Card className="shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">1. Introducción</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Bienvenido a SkillPilot. Estos términos y condiciones regulan el uso de nuestra plataforma de
                  búsqueda de empleo y procesamiento de currículums vitae. Al utilizar nuestros servicios,
                  aceptas estos términos en su totalidad.
                </p>
              </CardContent>
            </Card>

            {/* Tratamiento de Datos Personales */}
            <Card className="shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">2. Tratamiento de Datos Personales</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Datos que recopilamos:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
                    <li>Información personal contenida en tu CV (nombre, experiencia laboral, educación, habilidades)</li>
                    <li>Datos de contacto y preferencias profesionales</li>
                    <li>Información de uso de la plataforma y estadísticas de navegación</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Finalidad del tratamiento:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
                    <li>Procesar y analizar tu CV para generar recomendaciones personalizadas</li>
                    <li>Matching inteligente entre perfiles profesionales y ofertas de empleo</li>
                    <li>Mejorar nuestros servicios mediante análisis de datos anonimizados</li>
                    <li>Comunicaciones relacionadas con el servicio</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Seguridad y Confidencialidad */}
            <Card className="shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-purple-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3. Seguridad y Confidencialidad</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Nos comprometemos a proteger tu información personal mediante medidas de seguridad técnicas
                  y organizativas apropiadas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
                  <li>Cifrado de datos en tránsito y en reposo</li>
                  <li>Acceso restringido a la información personal solo al personal autorizado</li>
                  <li>Auditorías regulares de seguridad</li>
                  <li>No compartimos tu información con terceros sin tu consentimiento explícito</li>
                </ul>
              </CardContent>
            </Card>

            {/* Derechos del Usuario */}
            <Card className="shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-indigo-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">4. Derechos del Usuario</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  De acuerdo con la legislación de protección de datos aplicable, tienes los siguientes derechos:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
                  <li><strong>Derecho de acceso:</strong> Conocer qué datos personales tenemos sobre ti</li>
                  <li><strong>Derecho de rectificación:</strong> Corregir datos inexactos o incompletos</li>
                  <li><strong>Derecho de supresión:</strong> Solicitar la eliminación de tus datos</li>
                  <li><strong>Derecho de portabilidad:</strong> Obtener una copia de tus datos en formato estructurado</li>
                  <li><strong>Derecho de oposición:</strong> Oponerte al tratamiento de tus datos</li>
                  <li><strong>Derecho de limitación:</strong> Solicitar la limitación del tratamiento</li>
                </ul>
              </CardContent>
            </Card>

            {/* Uso del Servicio */}
            <Card className="shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5. Uso del Servicio</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Compromiso del usuario:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
                    <li>Proporcionar información veraz y actualizada en tu CV</li>
                    <li>No utilizar el servicio para fines ilegales o no autorizados</li>
                    <li>Respetar los derechos de propiedad intelectual</li>
                    <li>No intentar acceder a datos de otros usuarios</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Limitaciones:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 pl-4">
                    <li>El servicio se proporciona "tal como está"</li>
                    <li>No garantizamos la obtención de empleo a través de la plataforma</li>
                    <li>Nos reservamos el derecho de suspender cuentas que violen estos términos</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Retención de Datos */}
            <Card className="shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-red-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">6. Retención de Datos</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Conservaremos tus datos personales únicamente durante el tiempo necesario para cumplir
                  con las finalidades para las que fueron recopilados, o según requiera la legislación aplicable.
                  Puedes solicitar la eliminación de tu cuenta y datos asociados en cualquier momento.
                </p>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card className="shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-teal-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">7. Contacto</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Para ejercer tus derechos, realizar consultas sobre estos términos o sobre el tratamiento
                  de tus datos personales, puedes contactarnos a través de:
                </p>
                <div className="mt-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
                  <p className="text-gray-900 dark:text-white font-medium">Email: jorgemunozcast12@gmail.com</p>
                  <p className="text-gray-700 dark:text-gray-300">Responderemos a tu solicitud en un plazo máximo de 30 días</p>
                </div>
              </CardContent>
            </Card>

            {/* Modificaciones */}
            <Card className="shadow-lg bg-white dark:bg-gray-800/50">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Scale className="h-6 w-6 text-gray-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">8. Modificaciones</h2>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento.
                  Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma.
                  Te notificaremos de cambios significativos por email o mediante aviso en la plataforma.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Footer de la página de términos */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} SkillPilot. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
