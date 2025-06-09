<?php

namespace App\Services\JobSources;

interface JobSourceInterface
{
    /**
     * Obtiene ofertas de trabajo desde la fuente externa
     *
     * @return array Array de ofertas en formato crudo de la fuente
     */
    public function fetchOffers(): array;

    /**
     * Filtra ofertas basándose en el perfil del usuario
     *
     * @param array $offers Ofertas obtenidas de la fuente
     * @param mixed $profile Perfil del usuario
     * @return array Ofertas filtradas
     */
    public function filterOffers(array $offers, $profile): array;

    /**
     * Convierte una oferta del formato de la fuente al formato estándar
     *
     * @param array $offer Oferta en formato de la fuente
     * @return array Oferta en formato estándar
     */
    public function normalizeOffer(array $offer): array;

    /**
     * Obtiene el nombre identificador de la fuente
     *
     * @return string Nombre de la fuente
     */
    public function getSourceName(): string;
}
