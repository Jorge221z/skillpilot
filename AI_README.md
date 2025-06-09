# 🤖 AI Service para SkillPilot

## Resumen
Has implementado exitosamente un servicio de IA que se integra automáticamente en el flujo de búsqueda de ofertas laborales:

1. **Búsqueda automática** de ofertas en RemoteOK
2. **Análisis automático con IA** de cada oferta encontrada
3. **Generación automática** de recomendaciones y cartas de presentación

## 🏗️ Arquitectura Implementada

### Flujo Principal

1. **Usuario hace búsqueda** → `JobSearchController::fetchAndMatch()`
2. **Se encuentran ofertas coincidentes** → Se guardan en base de datos
3. **Para cada oferta** → Se llama automáticamente a la IA
4. **IA analiza y responde** → Se guardan recomendaciones y carta en `user_job_offers`

### Componentes Principales

#### 1. **AIService** (`app/Services/AIService.php`)
- Método principal: `analyzeJobMatch()` 
- Recibe perfil de usuario y datos de oferta
- Devuelve JSON con formato: `{"recomendaciones": [...], "carta": "..."}`

#### 2. **JobSearchController** (`app/Http/Controllers/JobSearchController.php`)
- `fetchAndMatch()`: Busca ofertas y las procesa automáticamente con IA
- `processWithAI()`: Método privado que maneja la integración con IA
- `getMatches()`: Obtiene las ofertas con análisis de IA incluido

### Base de Datos
- **`user_job_offers`**: Almacena matches con campos:
  - `ai_feedback`: JSON con recomendaciones de la IA
  - `cover_letter`: Carta de presentación generada

## 🚀 Cómo Funciona

### 1. Configuración Automática
Las variables de entorno ya están configuradas:
```bash
DO_ENDPOINT=https://oli4d7urqtimurg4vxbm23tk.agents.do-ai.run/api/v1/chat/completions
DO_SECRET_KEY=FTThLDFiw2XWXuK-38GiK4POAsRMgyjn
```

### 2. Flujo de Usuario
```
Usuario → Buscar ofertas → Sistema encuentra matches → IA analiza cada uno → Resultado completo
```

### 3. Formato de Respuesta de IA
```json
{
    "recomendaciones": [
        "Considera obtener certificación en AWS para destacar en este tipo de posiciones",
        "Menciona tu experiencia con APIs REST en tu perfil",
        "Agrega proyectos específicos con Laravel y Vue.js"
    ],
    "carta": "Estimados señores/as,\n\nMe dirijo a ustedes con gran interés por la posición de Desarrollador Full Stack en su empresa. Mi experiencia de 3+ años en desarrollo web con PHP y Laravel, combinada con mis conocimientos en Vue.js, me posicionan como un candidato ideal para contribuir al crecimiento de su equipo técnico.\n\nDurante mi trayectoria he desarrollado aplicaciones web escalables y APIs REST robustas, trabajando tanto en equipos ágiles como de forma independiente. Mi capacidad para adaptarme rápidamente a nuevas tecnologías y mi pasión por el código limpio me han permitido entregar soluciones efectivas en cada proyecto.\n\nEstaría encantado de poder discutir cómo mis habilidades pueden aportar valor a su organización. Quedo a su disposición para una entrevista en el momento que consideren conveniente.\n\nSaludos cordiales"
}
```

## 📡 Endpoints Disponibles

### Buscar y Analizar Ofertas
```bash
POST /jobs/fetch-and-match
```
- Busca ofertas en RemoteOK
- Filtra por perfil del usuario
- **Automáticamente** analiza cada match con IA
- Guarda recomendaciones y cartas

### Obtener Matches Analizados
```bash
GET /jobs/matches
```
- Devuelve ofertas con análisis de IA incluido
- Incluye `ai_feedback` y `cover_letter`

## 🧪 Testing

### Generar Datos de Prueba
```bash
php artisan db:seed --class=AITestDataSeeder
```

### Probar el Servicio de IA
```bash
php artisan ai:test --user-id=1 --job-offer-id=1
```

### Ejemplo de Respuesta de `getMatches()`
```json
{
    "matches": [
        {
            "id": 1,
            "job_offer_id": 1,
            "ai_feedback": "[\"Obtén certificación AWS\", \"Mejora portfolio\"]",
            "cover_letter": "Estimados señores/as...",
            "created_at": "2025-06-09T...",
            "job_offer": {
                "title": "Desarrollador Laravel Senior",
                "company": "TechCorp Solutions",
                "description": "...",
                "location": "Ciudad de México"
            }
        }
    ],
    "total": 1
}
```

## 🔧 Personalización

### Ajustar el Prompt de IA
En `AIService::buildCompleteAnalysisPrompt()`:
- Modifica las instrucciones para la IA
- Cambia el formato de respuesta si necesario
- Ajusta el número de recomendaciones

### Configurar Parámetros
En `config/ai.php`:
```php
'temperature' => 0.7,    // Creatividad (0.0 - 1.0)
'max_tokens' => 1500,    // Longitud máxima
'timeout' => 30,         // Timeout en segundos
```

## 🛡️ Manejo de Errores

- ✅ **Fallos de IA no interrumpen** el flujo principal de búsqueda
- ✅ **Logging automático** de errores en `storage/logs/laravel.log`
- ✅ **Fallback**: Si IA falla, las ofertas se guardan sin análisis
- ✅ **Timeout protection**: 30 segundos máximo por llamada

## 📊 Datos que Utiliza la IA

### Del Usuario:
- Nombre
- CV parseado (`parsed_cv`)  
- Habilidades (`skills`)
- Posición deseada (`desired_position`)

### De la Oferta:
- Título y empresa
- Descripción completa
- Ubicación
- Tags/habilidades requeridas

## 🎯 Ventajas de esta Implementación

1. **Automático**: No requiere intervención manual
2. **Integrado**: Forma parte natural del flujo de búsqueda  
3. **Resiliente**: Los errores de IA no afectan la funcionalidad principal
4. **Eficiente**: Un solo request de IA por oferta
5. **Escalable**: Fácil de extender a más fuentes de ofertas

---

**¡Tu flujo completo está listo! 🎉**

Cuando el usuario busque ofertas, automáticamente obtendrá:
- ✅ Ofertas filtradas por su perfil
- ✅ Recomendaciones personalizadas de IA  
- ✅ Cartas de presentación generadas
- ✅ Todo guardado en base de datos para consulta posterior
