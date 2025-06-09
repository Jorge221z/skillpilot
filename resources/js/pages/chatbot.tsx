import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Bot, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Chatbot',
        href: '/chatbot',
    },
];

export default function Chatbot() {
    const [chatbotLoaded, setChatbotLoaded] = useState(false);

    useEffect(() => {
        // Crear y añadir el script del chatbot cuando el componente se monta
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://oli4d7urqtimurg4vxbm23tk.agents.do-ai.run/static/chatbot/widget.js';
        script.setAttribute('data-agent-id', '467039ec-4519-11f0-bf8f-4e013e2ddde4');
        script.setAttribute('data-chatbot-id', 'zoEt1d4n0KIr-YaFaWgIfiPE36kXtUzw');
        script.setAttribute('data-name', 'Job AdvisorChatbot');
        script.setAttribute('data-primary-color', '#031B4E');
        script.setAttribute('data-secondary-color', '#E5E8ED');
        script.setAttribute('data-button-background-color', '#0061EB');
        script.setAttribute('data-starting-message', 'Hola! En que te puedo ayudar?');
        script.setAttribute('data-logo', '/static/chatbot/icons/default-agent.svg');

        script.onload = () => {
            setChatbotLoaded(true);
        };

        script.onerror = () => {
            console.error('Error al cargar el chatbot');
            setChatbotLoaded(false);
        };

        document.head.appendChild(script);

        // Timeout de respaldo en caso de que el script no dispare onload
        const loadTimeout = setTimeout(() => {
            if (!chatbotLoaded) {
                setChatbotLoaded(true);
            }
        }, 5000);

        // Cleanup: remover el script y todos los elementos del chatbot cuando el componente se desmonte
        return () => {
            clearTimeout(loadTimeout);
            setChatbotLoaded(false);

            // Remover el script
            const existingScript = document.querySelector('script[src="https://oli4d7urqtimurg4vxbm23tk.agents.do-ai.run/static/chatbot/widget.js"]');
            if (existingScript) {
                existingScript.remove();
            }

            // Remover cualquier elemento del chatbot que pueda haber quedado en el DOM
            const chatbotElements = document.querySelectorAll('[id*="chatbot"], [class*="chatbot"], [data-agent-id], iframe[src*="agents.do-ai.run"]');
            chatbotElements.forEach(element => {
                element.remove();
            });

            // También intentar remover elementos comunes de chatbots de terceros
            const commonChatbotSelectors = [
                'div[style*="position: fixed"][style*="bottom"]',
                'div[style*="z-index: 999"]',
                '.widget-container',
                '#widget-container'
            ];

            commonChatbotSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    // Solo remover si parece ser del chatbot (contiene referencias a agents.do-ai.run)
                    if (el.innerHTML.includes('agents.do-ai.run') || el.innerHTML.includes('chatbot')) {
                        el.remove();
                    }
                });
            });
        };
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Job Advisor Chatbot" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Card className="w-full max-w-4xl mx-auto">
                    <CardHeader>
                        <div className="text-center">
                            <CardTitle className="flex items-center justify-center gap-3 text-primary text-2xl">
                                <Bot className="h-6 w-6" />
                                Job Advisor Chatbot
                            </CardTitle>
                            <CardDescription className="mt-2">
                                Asistente inteligente para ayudarte con consejos profesionales y búsqueda de empleo
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Información sobre el chatbot */}
                            <div className="bg-muted/50 rounded-lg p-6">
                                <div className="flex items-start gap-4">
                                    <MessageCircle className="h-8 w-8 text-primary mt-1" />
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold">¿Cómo te puede ayudar?</h3>
                                        <ul className="space-y-2 text-muted-foreground">
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                Consejos para mejorar tu CV y perfil profesional
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                Estrategias de búsqueda de empleo personalizada
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                Preparación para entrevistas de trabajo
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                Análisis de ofertas de trabajo y compatibilidad
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                Desarrollo de habilidades técnicas y profesionales
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Instrucciones de uso */}
                            <div className="text-center space-y-4">
                                <div className="flex items-center justify-center gap-2">
                                    {!chatbotLoaded && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <h3 className="text-lg font-semibold text-muted-foreground">
                                        {chatbotLoaded
                                            ? "El chatbot está listo. Busca el botón en la esquina inferior derecha"
                                            : "Cargando chatbot..."
                                        }
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {chatbotLoaded
                                        ? "El chatbot aparecerá como un icono flotante. Haz clic en él para empezar a conversar."
                                        : "Por favor espera mientras se carga el asistente inteligente."
                                    }
                                </p>
                            </div>

                            {/* Espaciador para asegurar que el contenido no tape el chatbot */}
                            <div className="h-20"></div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
