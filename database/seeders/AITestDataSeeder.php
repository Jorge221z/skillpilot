<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use App\Models\JobOffer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AITestDataSeeder extends Seeder
{

    public function run(): void
    {
        // Crear usuario de prueba
        $user = User::firstOrCreate(
            ['email' => 'test@skillpilot.com'],
            [
                'name' => 'Juan Pérez',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // Crear perfil de usuario
        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'desired_position' => 'Desarrollador Full Stack',
                'skills' => [
                    'PHP', 'Laravel', 'JavaScript', 'Vue.js', 'MySQL',
                    'Docker', 'Git', 'API REST', 'HTML', 'CSS'
                ],
                'parsed_cv' => 'Desarrollador con 3+ años de experiencia en desarrollo web.

Experiencia:
- Desarrollador Senior en TechSolutions (2022-2025): Desarrollo de aplicaciones web con Laravel y Vue.js
- Desarrollador Junior en StartupXYZ (2021-2022): Mantenimiento y desarrollo de features en aplicaciones PHP
- Freelancer (2020-2021): Desarrollo de sitios web para pequeñas empresas

Educación:
- Ingeniería en Sistemas Computacionales - Universidad Tecnológica (2020)
- Certificación Laravel Professional - Laracasts (2021)
- Curso de Vue.js Avanzado - Platzi (2022)

Proyectos destacados:
- Sistema de gestión empresarial con Laravel y Vue.js
- E-commerce con integración de pagos (Stripe, PayPal)
- API REST para aplicación móvil con autenticación JWT',
                'cv_filename' => 'juan_perez_cv.pdf'
            ]
        );

        // Crear ofertas de trabajo de ejemplo
        $jobOffers = [
            [
                'title' => 'Desarrollador Laravel Senior',
                'company' => 'TechCorp Solutions',
                'description' => 'Buscamos un desarrollador Laravel senior con experiencia en desarrollo de aplicaciones web escalables.

Requisitos:
- 3+ años de experiencia con Laravel
- Conocimiento en Vue.js o React
- Experiencia con bases de datos MySQL/PostgreSQL
- Conocimiento en Docker y CI/CD
- Experiencia con APIs REST
- Conocimiento en Git y metodologías ágiles

Responsabilidades:
- Desarrollar y mantener aplicaciones web con Laravel
- Colaborar en el diseño de arquitectura de software
- Implementar APIs REST robustas
- Trabajar en equipo usando metodologías ágiles
- Mentorear desarrolladores junior

Ofrecemos:
- Salario competitivo $50,000 - $70,000 MXN
- Trabajo remoto híbrido
- Prestaciones superiores
- Capacitación continua',
                'location' => 'Ciudad de México, México',
                'tags' => ['Laravel', 'PHP', 'Vue.js', 'MySQL', 'Docker', 'API REST', 'Git'],
                'url' => 'https://techcorp.com/jobs/laravel-senior',
                'source' => 'LinkedIn',
                'hash' => md5('TechCorp Solutions Desarrollador Laravel Senior')
            ],
            [
                'title' => 'Full Stack Developer',
                'company' => 'InnovateLab',
                'description' => 'Únete a nuestro equipo como Full Stack Developer y ayuda a construir la próxima generación de aplicaciones web.

Requisitos técnicos:
- Experiencia sólida en PHP (Laravel preferible)
- Conocimiento en JavaScript moderno (ES6+)
- Experiencia con frameworks frontend (Vue.js, React, o Angular)
- Bases de datos relacionales (MySQL, PostgreSQL)
- Control de versiones con Git
- Conocimiento básico de DevOps (Docker, CI/CD)

Habilidades deseadas:
- Experiencia con TDD/BDD
- Conocimiento en arquitecturas de microservicios
- Experiencia con servicios en la nube (AWS, GCP)
- Familiaridad con metodologías ágiles (Scrum, Kanban)

Responsabilidades:
- Desarrollar features end-to-end
- Colaborar en el diseño de soluciones técnicas
- Optimizar rendimiento de aplicaciones
- Participar en code reviews
- Documentar código y procesos

Beneficios:
- Salario $45,000 - $65,000 MXN
- Trabajo 100% remoto
- Horarios flexibles
- Budget para capacitación
- Ambiente de trabajo colaborativo',
                'location' => 'Remoto',
                'tags' => ['PHP', 'Laravel', 'JavaScript', 'Vue.js', 'React', 'MySQL', 'Git', 'Docker'],
                'url' => 'https://innovatelab.com/careers/fullstack',
                'source' => 'Indeed',
                'hash' => md5('InnovateLab Full Stack Developer')
            ],
            [
                'title' => 'Backend Developer - Python',
                'company' => 'DataDriven Inc',
                'description' => 'Buscamos Backend Developer especializado en Python para trabajar en proyectos de análisis de datos y machine learning.

Requisitos:
- 2+ años de experiencia con Python
- Experiencia con Django o FastAPI
- Conocimiento en bases de datos SQL y NoSQL
- Experiencia con Docker y Kubernetes
- Familiaridad con servicios de AWS
- Conocimiento básico de Machine Learning

Deseable:
- Experiencia con Apache Spark
- Conocimiento en TensorFlow o PyTorch
- Certificaciones en AWS
- Experiencia con Apache Kafka
- Conocimiento en DataOps

Ofrecemos:
- Salario $55,000 - $80,000 MXN
- Trabajo híbrido (2 días oficina)
- Proyectos innovadores con IA
- Crecimiento profesional acelerado',
                'location' => 'Guadalajara, México',
                'tags' => ['Python', 'Django', 'FastAPI', 'Docker', 'AWS', 'Machine Learning', 'SQL'],
                'url' => 'https://datadriven.com/jobs/backend-python',
                'source' => 'CompanyWebsite',
                'hash' => md5('DataDriven Inc Backend Developer - Python')
            ]
        ];

        foreach ($jobOffers as $jobOfferData) {
            JobOffer::firstOrCreate(
                ['hash' => $jobOfferData['hash']],
                $jobOfferData
            );
        }

        $this->command->info('✅ AI Test data seeded successfully!');
        $this->command->info('   - Created user: test@skillpilot.com (password: password123)');
        $this->command->info('   - Created user profile with skills and CV');
        $this->command->info('   - Created 3 sample job offers');
        $this->command->info('');
        $this->command->info('You can now test the AI service with:');
        $this->command->info('   php artisan ai:test --user-id=' . $user->id . ' --job-offer-id=1');
    }
}
