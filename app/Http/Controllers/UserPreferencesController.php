<?php

namespace App\Http\Controllers;

use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Smalot\PdfParser\Parser;

class UserPreferencesController extends Controller
{
    /**
     * Procesar CV y guardar perfil del usuario
     */
    public function processCV(Request $request)
    {
        $request->validate([
            'cv_file' => 'required|file|mimes:pdf|max:10240', // 10MB max
            'desired_position' => 'nullable|string|max:255',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:100'
        ]);

        try {
            // Obtener el archivo PDF
            $cvFile = $request->file('cv_file');

            // Crear instancia del parser PDF
            $parser = new Parser();

            // Parsear el PDF y extraer texto
            $pdf = $parser->parseFile($cvFile->getPathname());
            $parsedText = $pdf->getText();

            // Limpiar el texto extraído
            $cleanedText = $this->cleanExtractedText($parsedText);

            // Buscar o crear perfil del usuario
            $userProfile = UserProfile::updateOrCreate(
                ['user_id' => Auth::id()],
                [
                    'desired_position' => $request->desired_position,
                    'technologies' => $request->technologies,
                    'parsed_cv' => $cleanedText
                ]
            );

            // Opcionalmente guardar el archivo original
            if ($request->has('save_original') && $request->save_original) {
                $fileName = 'cv_' . Auth::id() . '_' . time() . '.pdf';
                $cvFile->storeAs('cvs', $fileName, 'private');
            }

            // Redirigir de vuelta a la página de perfil con mensaje de éxito
            return redirect()->back()->with('success', 'CV procesado y perfil guardado exitosamente');

        } catch (\Exception $e) {
            // Redirigir de vuelta con mensaje de error
            return redirect()->back()->with('error', 'Error al procesar el CV: ' . $e->getMessage());
        }
    }

    /**
     * Obtener perfil del usuario actual
     */
    public function getUserProfile()
    {
        $userProfile = UserProfile::where('user_id', Auth::id())->first();

        return response()->json([
            'success' => true,
            'data' => $userProfile
        ]);
    }

    /**
     * Actualizar perfil del usuario
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'desired_position' => 'nullable|string|max:255',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:100'
        ]);

        $userProfile = UserProfile::updateOrCreate(
            ['user_id' => Auth::id()],
            [
                'desired_position' => $request->desired_position,
                'technologies' => $request->technologies,
            ]
        );

        return redirect()->back()->with('success', 'Perfil actualizado exitosamente');
    }

    /**
     * Limpiar texto extraído del PDF
     */
    private function cleanExtractedText($text)
    {
        // Eliminar caracteres especiales y normalizar espacios
        $text = preg_replace('/\s+/', ' ', $text);
        $text = trim($text);

        // Eliminar caracteres no imprimibles
        $text = preg_replace('/[^\x20-\x7E\x{00A0}-\x{024F}\x{1E00}-\x{1EFF}]/u', '', $text);

        return $text;
    }
}
