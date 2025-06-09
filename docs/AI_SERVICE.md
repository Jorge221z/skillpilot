# AI Service - Documentación de Uso

## Descripción
El servicio de IA permite analizar matches entre usuarios y ofertas de trabajo, generar cartas de presentación personalizadas y proporcionar feedback para mejorar perfiles.

## Configuración
Las claves de la IA están configuradas en `.env`:
- `DO_ENDPOINT`: Endpoint del servicio de IA
- `DO_SECRET_KEY`: Clave secreta para autenticación

## Endpoints Disponibles

### 1. Analizar Match de Trabajo
**POST** `/ai/analyze-match`

Analiza la compatibilidad entre un usuario y una oferta de trabajo.

**Parámetros:**
```json
{
    "job_offer_id": 1,
    "user_id": 1 // Opcional, usa el usuario autenticado por defecto
}
```

**Respuesta:**
```json
{
    "success": true,
    "data": {
        "match_id": 1,
        "match_score": 85,
        "analysis": {
            "match_score": 85,
            "strengths": ["Python", "Django", "Machine Learning"],
            "improvements": ["Certificación AWS", "Experiencia en DevOps"],
            "recommendations": ["Completar curso de Docker", "Añadir proyectos de ML"],
            "summary": "Excelente match para la posición..."
        },
        "job_offer": {...}
    },
    "message": "Análisis completado exitosamente"
}
```

### 2. Generar Carta de Presentación
**POST** `/ai/generate-cover-letter`

Genera una carta de presentación personalizada.

**Parámetros:**
```json
{
    "job_offer_id": 1,
    "user_id": 1 // Opcional
}
```

**Respuesta:**
```json
{
    "success": true,
    "data": {
        "cover_letter": "Estimados señores/as,\n\nMe dirijo a ustedes...",
        "match_id": 1
    },
    "message": "Carta de presentación generada exitosamente"
}
```

### 3. Generar Feedback de Perfil
**POST** `/ai/generate-feedback`

Proporciona feedback para mejorar el perfil del usuario.

**Parámetros:**
```json
{
    "job_offer_id": 1,
    "user_id": 1 // Opcional
}
```

**Respuesta:**
```json
{
    "success": true,
    "data": {
        "feedback": "Para mejorar tu perfil para esta posición, te recomiendo...",
        "job_offer": {
            "title": "Desarrollador Python",
            "company": "TechCorp"
        }
    },
    "message": "Feedback generado exitosamente"
}
```

### 4. Obtener Matches del Usuario
**GET** `/ai/matches`

Obtiene todos los matches de un usuario con paginación.

**Parámetros de query opcionales:**
- `user_id`: ID del usuario (usa el autenticado por defecto)

**Respuesta:**
```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [...],
        "per_page": 10,
        "total": 25
    },
    "message": "Matches obtenidos exitosamente"
}
```

### 5. Obtener Detalles de un Match
**GET** `/ai/matches/{matchId}`

Obtiene los detalles completos de un match específico.

**Respuesta:**
```json
{
    "success": true,
    "data": {
        "id": 1,
        "match_score": 85,
        "ai_feedback": "...",
        "cover_letter": "...",
        "tags": [...],
        "job_offer": {...},
        "user": {...}
    },
    "message": "Detalles del match obtenidos exitosamente"
}
```

## Uso desde JavaScript/Frontend

### Ejemplo con Fetch
```javascript
// Analizar match
const analyzeMatch = async (jobOfferId) => {
    try {
        const response = await fetch('/ai/analyze-match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                job_offer_id: jobOfferId
            })
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('Match Score:', data.data.match_score);
            console.log('Analysis:', data.data.analysis);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Generar carta de presentación
const generateCoverLetter = async (jobOfferId) => {
    try {
        const response = await fetch('/ai/generate-cover-letter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                job_offer_id: jobOfferId
            })
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('Cover Letter:', data.data.cover_letter);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
```

### Ejemplo con Axios
```javascript
import axios from 'axios';

// Configurar Axios con token CSRF
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').content;

// Analizar match
const analyzeMatch = async (jobOfferId) => {
    try {
        const response = await axios.post('/ai/analyze-match', {
            job_offer_id: jobOfferId
        });
        
        if (response.data.success) {
            return response.data.data;
        }
    } catch (error) {
        console.error('Error analyzing match:', error);
        throw error;
    }
};

// Obtener matches del usuario
const getUserMatches = async () => {
    try {
        const response = await axios.get('/ai/matches');
        return response.data.data;
    } catch (error) {
        console.error('Error getting matches:', error);
        throw error;
    }
};
```

## Uso desde PHP/Backend

### Ejemplo en un Controller
```php
<?php

namespace App\Http\Controllers;

use App\Services\AIService;
use App\Models\User;
use App\Models\JobOffer;

class ExampleController extends Controller
{
    private AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = $aiService;
    }

    public function processJobApplication($userId, $jobOfferId)
    {
        $user = User::with('profile')->findOrFail($userId);
        $jobOffer = JobOffer::findOrFail($jobOfferId);

        // Preparar datos
        $userProfile = [
            'name' => $user->name,
            'experience' => $user->profile->parsed_cv ?? '',
            'skills' => $user->profile->skills ?? [],
            'education' => $user->profile->parsed_cv ?? '',
            'desired_position' => $user->profile->desired_position ?? '',
        ];

        $jobOfferData = [
            'title' => $jobOffer->title,
            'company' => $jobOffer->company,
            'description' => $jobOffer->description,
            'location' => $jobOffer->location,
            'tags' => $jobOffer->tags ?? [],
        ];

        // Analizar match
        $analysis = $this->aiService->analyzeJobMatch($userProfile, $jobOfferData);
        
        // Generar carta de presentación
        $coverLetter = $this->aiService->generateCoverLetter($userProfile, $jobOfferData);
        
        // Generar feedback
        $feedback = $this->aiService->generateProfileFeedback($userProfile, $jobOfferData);

        return [
            'analysis' => $analysis,
            'cover_letter' => $coverLetter,
            'feedback' => $feedback
        ];
    }
}
```

## Manejo de Errores

El servicio maneja automáticamente los errores y los registra en los logs de Laravel. Los errores comunes incluyen:

- **Timeout**: Si la API de IA no responde en 30 segundos
- **Authentication**: Si las credenciales son incorrectas
- **Rate Limiting**: Si se excede el límite de llamadas
- **Invalid Response**: Si la respuesta de la IA no es válida

## Configuración Adicional

Puedes ajustar los parámetros del servicio de IA en `config/ai.php`:

```php
return [
    'endpoint' => env('DO_ENDPOINT', ''),
    'secret_key' => env('DO_SECRET_KEY', ''),
    'timeout' => env('AI_TIMEOUT', 30),
    'max_tokens' => env('AI_MAX_TOKENS', 1500),
    'temperature' => env('AI_TEMPERATURE', 0.7),
    'model' => env('AI_MODEL', 'gpt-4'),
];
```

## Logs y Debugging

Los errores se registran automáticamente en `storage/logs/laravel.log`. Para debugging adicional, puedes verificar:

1. Las claves de configuración en `.env`
2. Los logs de Laravel
3. La respuesta de la API de IA
4. Los datos que se envían en los prompts
