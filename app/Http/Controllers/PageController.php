<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    /* Este controlador maneja todas las rutas de páginas estáticas. */

    public function home()
    {
        return Inertia::render('welcome', [
            'meta' => [
                'title' => 'SkillPilot - Encuentra tu empleo ideal con IA | Búsqueda inteligente de trabajo',
                'description' => 'Plataforma inteligente que busca ofertas de empleo adaptadas a tus preferencias y te ayuda a optimizar tu candidatura mediante IA. Encuentra tu trabajo ideal con SkillPilot.',
                'keywords' => 'empleo, trabajo, ofertas de trabajo, IA, inteligencia artificial, candidatura, CV, búsqueda de empleo, SkillPilot, empleo con IA'
            ]
        ]);
    }

    public function chatbot()
    {
        return Inertia::render('chatbot', [
            'meta' => [
                'title' => 'Chatbot IA - SkillPilot',
                'description' => 'Utiliza nuestro chatbot inteligente para obtener consejos personalizados sobre tu búsqueda de empleo y mejora tu candidatura con IA.',
                'keywords' => 'chatbot, IA, consejos empleo, asistente virtual, SkillPilot, candidatura, CV, entrevista'
            ]
        ]);
    }

    public function about()
    {
        return Inertia::render('about', [
            'meta' => [
                'title' => 'Sobre SkillPilot - Búsqueda de empleo con IA',
                'description' => 'Conoce más sobre SkillPilot, la plataforma que revoluciona la búsqueda de empleo utilizando inteligencia artificial para conectar talento con oportunidades.',
                'keywords' => 'sobre SkillPilot, misión, visión, equipo, búsqueda empleo IA, plataforma empleo'
            ]
        ]);
    }

    public function termsAndConditions()
    {
        return Inertia::render('terms-and-conditions', [
            'meta' => [
                'title' => 'Términos y Condiciones - SkillPilot',
                'description' => 'Lee los términos y condiciones de uso de SkillPilot. Conoce nuestras políticas de privacidad y condiciones de servicio.',
                'keywords' => 'términos, condiciones, privacidad, políticas, SkillPilot, uso plataforma'
            ]
        ]);
    }
}
