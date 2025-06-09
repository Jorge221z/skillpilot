<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use App\Models\JobOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class JobSearchController extends Controller
{
    public function fetchAndMatch(Request $request)
    {
        $user = Auth::user(); // Obtener perfil del usuario autenticado
        $profile = $user->profile; //Usamos el perfil del usuario para obtener sus preferencias

        if (!$profile || !$profile->desired_position || !$profile->skills) { // Verificar si el perfil está completo
            return back()->with('error', 'Por favor, completa tu perfil antes de buscar ofertas de trabajo.');
        }

        /** A partir de aqui comienza la parte de scraping(de momento solo lo hacemos con remoteOK) */

        $response = Http::withHeaders([  //scrapeamos la api de remoteOK//
            'Accept' => 'application/json',
            ])->get('https://remoteok.com/api');

        $offers = $response->json(); //lo pasamos a json//
        if (empty($offers)) {
            return back()->with('error', 'No se encontraron ofertas de trabajo en RemoteOK.');
        }

        $matches = $offers->filter(function ($offer) use ($profile) {       //recorremos las ofertas y filtramos las que coinciden con el perfil del usuario
        $titleMatch = str_contains(strtolower($offer['position']), strtolower($profile->desired_position)); //compara el titulo de la oferta con el puesto deseado//

        $skillMatch = collect($profile->skills)->some(function ($skill) use ($offer) { //si alguna skill del perfil coincide con la descripcion de la oferta hará match//
            return str_contains(strtolower($offer['description']), strtolower($skill));
        });

        return $titleMatch || $skillMatch; //retorna true si hay coincidencia en el titulo o en las skills(o ambas)//
    });

        // Guardar las ofertas coincidentes en la base de datos
        foreach ($matches as $offer) {
            // Generar hash único para evitar duplicados
            $hash = hash('sha256', $offer['position'] . $offer['company'] . $offer['url']);

            // Crear o actualizar la oferta en job_offers
            $jobOffer = JobOffer::updateOrCreate(
                ['hash' => $hash],
                [
                    'title' => $offer['position'],
                    'company' => $offer['company'],
                    'description' => $offer['description'],
                    'location' => $offer['location'] ?? null,
                    'tags' => isset($offer['tags']) ? $offer['tags'] : null,
                    'url' => $offer['url'],
                    'source' => 'remoteok',
                    'hash' => $hash,
                ]
            );

            // Crear la relación usuario-oferta en job_matches
            $user->jobMatches()->updateOrCreate(
                ['job_offer_id' => $jobOffer->id],
                [
                    'position' => $offer['position'],
                    'company' => $offer['company'],
                    'location' => $offer['location'],
                    'description' => $offer['description'],
                    'url' => $offer['url']
                ]
            );
        }
        // Redirigir de vuelta con mensaje de éxito
        return back()->with('success', 'Ofertas de trabajo coincidentes encontradas y guardadas en tu perfil.');
    }
}
