# Sistema Modular de Búsqueda de Ofertas de Trabajo

## Descripción

El sistema de búsqueda de ofertas de trabajo ha sido modularizado para permitir la fácil adición de nuevas fuentes de ofertas. Cada fuente de ofertas se implementa como un servicio independiente que sigue una interfaz común.

## Arquitectura

### Componentes Principales

1. **JobSourceInterface** - Interfaz que define el contrato para todas las fuentes de ofertas
2. **JobSourceManager** - Gestor central que coordina todas las fuentes
3. **Servicios de Fuentes** - Implementaciones específicas para cada fuente (RemoteOK, LinkedIn, etc.)
4. **JobSearchController** - Controlador simplificado que usa el sistema modular

### Estructura de Archivos

```
app/
├── Services/
│   ├── JobSourceManager.php
│   └── JobSources/
│       ├── JobSourceInterface.php
│       ├── RemoteOkService.php
│       └── LinkedInService.php (ejemplo)
└── Http/Controllers/
    └── JobSearchController.php
```

## Uso

### Búsqueda en Todas las Fuentes

```php
// En el controlador
$result = $this->jobSourceManager->fetchAndProcessOffers($user, $profile);
```

### Búsqueda en una Fuente Específica

```php
// En el controlador
$result = $this->jobSourceManager->fetchFromSource('remoteok', $user, $profile);
```

### Obtener Fuentes Disponibles

```php
$sources = $this->jobSourceManager->getSources();
```

## Añadir una Nueva Fuente

Para añadir una nueva fuente de ofertas, sigue estos pasos:

### 1. Crear el Servicio de la Fuente

Crea un nuevo archivo en `app/Services/JobSources/` que implemente `JobSourceInterface`:

```php
<?php

namespace App\Services\JobSources;

class TuNuevaFuenteService implements JobSourceInterface
{
    public function fetchOffers(): array
    {
        // Implementar lógica para obtener ofertas de la fuente externa
    }

    public function filterOffers(array $offers, $profile): array
    {
        // Implementar lógica de filtrado según el perfil del usuario
    }

    public function normalizeOffer(array $offer): array
    {
        // Convertir la oferta al formato estándar
        return [
            'title' => $offer['titulo'],
            'company' => $offer['empresa'],
            'description' => $offer['descripcion'],
            'location' => $offer['ubicacion'],
            'tags' => $offer['tecnologias'],
            'url' => $offer['enlace'],
            'source' => 'tu-fuente',
            'hash' => hash('sha256', $offer['titulo'] . $offer['empresa'] . $offer['enlace']),
        ];
    }

    public function getSourceName(): string
    {
        return 'tu-fuente';
    }
}
```

### 2. Registrar la Fuente

En `JobSourceManager.php`, añade tu nueva fuente en el constructor:

```php
public function __construct()
{
    $this->registerSource(new RemoteOkService());
    $this->registerSource(new TuNuevaFuenteService()); // Añadir aquí
}
```

### 3. Configuración (Opcional)

Si tu fuente requiere configuración (API keys, etc.), añádela en `config/services.php`:

```php
'tu-fuente' => [
    'api_key' => env('TU_FUENTE_API_KEY'),
    'api_url' => env('TU_FUENTE_API_URL', 'https://api.tu-fuente.com'),
],
```

## Métodos de la Interfaz

### `fetchOffers(): array`
- Obtiene ofertas crudas de la fuente externa
- Debe retornar un array de ofertas en el formato nativo de la fuente
- Maneja errores y retorna array vacío en caso de fallo

### `filterOffers(array $offers, $profile): array`
- Filtra ofertas basándose en el perfil del usuario
- Recibe ofertas crudas y el perfil del usuario
- Retorna solo las ofertas que coinciden con los criterios

### `normalizeOffer(array $offer): array`
- Convierte una oferta del formato de la fuente al formato estándar
- Debe retornar un array con las claves estándar: title, company, description, location, tags, url, source, hash

### `getSourceName(): string`
- Retorna el identificador único de la fuente
- Se usa para logging, configuración y referencia

## Endpoints Disponibles

### POST `/job-search/fetch`
Busca ofertas en todas las fuentes disponibles.

### POST `/job-search/fetch/{source}`
Busca ofertas en una fuente específica.

### GET `/job-search/sources`
Obtiene la lista de fuentes disponibles.

### GET `/job-search/matches`
Obtiene las ofertas coincidentes del usuario.

## Ventajas del Sistema Modular

1. **Escalabilidad** - Fácil añadir nuevas fuentes sin modificar código existente
2. **Mantenibilidad** - Cada fuente es independiente y fácil de mantener
3. **Flexibilidad** - Permite búsquedas en fuentes específicas o todas a la vez
4. **Testabilidad** - Cada servicio puede ser testeado independientemente
5. **Reutilización** - Las fuentes pueden ser reutilizadas en otros contextos

## Ejemplo de Flujo

1. Usuario solicita búsqueda de ofertas
2. `JobSearchController` valida el perfil del usuario
3. `JobSourceManager` coordina la búsqueda en todas las fuentes
4. Cada `JobSourceService` obtiene y filtra ofertas
5. `JobSourceManager` normaliza y guarda las ofertas
6. Se retorna el resultado al usuario

## Logging

El sistema incluye logging detallado para monitorear:
- Ofertas obtenidas por fuente
- Errores en fuentes específicas
- Ofertas procesadas y guardadas
- Rendimiento de cada fuente
