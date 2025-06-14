<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PageController extends Controller
{
    /* Este controlador maneja todas las rutas de páginas estáticas. */

    public function home()
    {
        return Inertia::render('welcome');
    }

    public function chatbot()
    {
        return Inertia::render('chatbot');
    }

    public function about()
    {
        return Inertia::render('about');
    }

    public function termsAndConditions()
    {
        return Inertia::render('terms-and-conditions');
    }
}
