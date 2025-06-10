"use client"

import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MessageCircle, Bot, Loader2, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Chatbot",
    href: "/chatbot",
  },
]

export default function Chatbot() {
  const [chatbotLoaded, setChatbotLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.async = true
    script.src = "https://oli4d7urqtimurg4vxbm23tk.agents.do-ai.run/static/chatbot/widget.js"
    script.setAttribute("data-agent-id", "467039ec-4519-11f0-bf8f-4e013e2ddde4")
    script.setAttribute("data-chatbot-id", "zoEt1d4n0KIr-YaFaWgIfiPE36kXtUzw")
    script.setAttribute("data-name", "Job AdvisorChatbot")
    script.setAttribute("data-primary-color", "#031B4E")
    script.setAttribute("data-secondary-color", "#E5E8ED")
    script.setAttribute("data-button-background-color", "#0061EB")
    script.setAttribute("data-starting-message", "Hola! En que te puedo ayudar?")
    script.setAttribute("data-logo", "/static/chatbot/icons/default-agent.svg")

    script.onload = () => {
      setChatbotLoaded(true)
    }

    script.onerror = () => {
      console.error("Error al cargar el chatbot")
      setChatbotLoaded(false)
    }

    document.head.appendChild(script)

    const loadTimeout = setTimeout(() => {
      if (!chatbotLoaded) {
        setChatbotLoaded(true)
      }
    }, 5000)

    return () => {
      clearTimeout(loadTimeout)
      setChatbotLoaded(false)

      const existingScript = document.querySelector(
        'script[src="https://oli4d7urqtimurg4vxbm23tk.agents.do-ai.run/static/chatbot/widget.js"]',
      )
      if (existingScript) {
        existingScript.remove()
      }

      const chatbotElements = document.querySelectorAll(
        '[id*="chatbot"], [class*="chatbot"], [data-agent-id], iframe[src*="agents.do-ai.run"]',
      )
      chatbotElements.forEach((element) => {
        element.remove()
      })

      const commonChatbotSelectors = [
        'div[style*="position: fixed"][style*="bottom"]',
        'div[style*="z-index: 999"]',
        ".widget-container",
        "#widget-container",
      ]

      commonChatbotSelectors.forEach((selector) => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((el) => {
          if (el.innerHTML.includes("agents.do-ai.run") || el.innerHTML.includes("chatbot")) {
            el.remove()
          }
        })
      })
    }
  }, [])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job Advisor Chatbot" />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 border-b-4 border-b-blue-500 pb-4">
              <Bot className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Job Advisor Chatbot</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">Asistente inteligente para consejos profesionales</p>
          </div>

          <Card className="w-full max-w-2xl mx-auto shadow-lg bg-white dark:bg-gray-800/50">
            <CardHeader className="text-center pb-6">
              {/* Status */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {chatbotLoaded ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">Chatbot disponible</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Cargando...</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Main Info */}
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {chatbotLoaded ? "El chatbot está listo para ayudarte" : "Preparando tu asistente personal"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {chatbotLoaded
                      ? "Busca el botón flotante en la esquina inferior derecha para empezar a conversar."
                      : "Por favor espera mientras cargamos tu asistente inteligente."}
                  </p>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">¿En qué te puede ayudar?</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Consejos para mejorar tu CV</li>
                  <li>• Estrategias de búsqueda de empleo</li>
                  <li>• Preparación para entrevistas</li>
                  <li>• Análisis de ofertas de trabajo</li>
                </ul>
              </div>

              {/* Spacer */}
              <div className="h-16"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
