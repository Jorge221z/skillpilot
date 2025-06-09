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

        // Convertir a colección para poder usar filter
        $offers = collect($offers);

        $matches = $offers->filter(function ($offer) use ($profile) {       //recorremos las ofertas y filtramos las que coinciden con el perfil del usuario
            // Verificar que los campos necesarios existen
            if (!isset($offer['position']) || !isset($offer['description'])) {
                return false;
            }

            $titleMatch = str_contains(strtolower($offer['position']), strtolower($profile->desired_position)); //compara el titulo de la oferta con el puesto deseado//

            $skillMatch = false;
            if ($profile->skills && is_array($profile->skills)) {
                // Limpiar la descripción para hacer la comparación más efectiva
                $cleanDescription = $this->cleanDescription($offer['description']);

                $skillMatch = collect($profile->skills)->some(function ($skill) use ($cleanDescription) { //si alguna skill del perfil coincide con la descripcion de la oferta hará match//
                    return str_contains(strtolower($cleanDescription), strtolower($skill));
                });
            }

            return $titleMatch || $skillMatch; //retorna true si hay coincidencia en el titulo o en las skills(o ambas)//
        });

        // Guardar las ofertas coincidentes en la base de datos
        foreach ($matches as $offer) {
            // Verificar que los campos obligatorios existen
            if (!isset($offer['position']) || !isset($offer['company']) || !isset($offer['url'])) {
                continue;
            }

            // Generar hash único para evitar duplicados
            $hash = hash('sha256', $offer['position'] . $offer['company'] . $offer['url']);

            // Crear o actualizar la oferta en job_offers
            $jobOffer = JobOffer::updateOrCreate(
                ['hash' => $hash],
                [
                    'title' => $offer['position'],
                    'company' => $offer['company'],
                    'description' => $this->cleanDescription($offer['description'] ?? ''),
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
                    'user_id' => $user->id,
                    'job_offer_id' => $jobOffer->id,
                ]
            );
        }
        // Redirigir de vuelta con mensaje de éxito
        return back()->with('success', 'Ofertas de trabajo coincidentes encontradas y guardadas en tu perfil.');
    }

    public function getMatches()
    {
        $user = Auth::user();

        // Obtener las ofertas del usuario con la información de la oferta de trabajo
        $matches = $user->jobMatches()
            ->with('jobOffer')
            ->latest()
            ->get()
            ->map(function ($match) {
                return [
                    'id' => $match->id,
                    'job_offer_id' => $match->job_offer_id,
                    'match_score' => $match->match_score,
                    'tags' => $match->tags,
                    'ai_feedback' => $match->ai_feedback,
                    'cover_letter' => $match->cover_letter,
                    'created_at' => $match->created_at,
                    'job_offer' => [
                        'id' => $match->jobOffer->id,
                        'title' => $match->jobOffer->title,
                        'company' => $match->jobOffer->company,
                        'description' => $match->jobOffer->description,
                        'location' => $match->jobOffer->location,
                        'tags' => $match->jobOffer->tags,
                        'url' => $match->jobOffer->url,
                        'source' => $match->jobOffer->source,
                        'created_at' => $match->jobOffer->created_at,
                    ]
                ];
            });

        return response()->json([
            'matches' => $matches,
            'total' => $matches->count()
        ]);
    }

    /**
     * Limpia el contenido HTML de una descripción
     */
    private function cleanDescription($description)
    {
        if (empty($description)) {
            return '';
        }

        // Convertir entidades HTML
        $description = html_entity_decode($description, ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // Eliminar todas las etiquetas HTML
        $description = strip_tags($description);

        // Limpiar espacios en blanco excesivos
        $description = preg_replace('/\s+/', ' ', $description);

        // Eliminar espacios al inicio y final
        $description = trim($description);

        return $description;
    }
}
