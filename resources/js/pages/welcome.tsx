import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="SkillPilot - Plataforma de Búsqueda de Empleo con IA">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 to-slate-900 text-white">
                {/* Header con navegación */}
                <header className="container mx-auto w-full max-w-7xl px-6 py-6">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Logo */}
                            <div className="h-13 w-13 rounded-full bg-gradient-to-br from-blue-200 to-blue-800 p-0 shadow-lg shadow-blue-500/20">
                                <div className="relative h-full w-full">
                                    <img
                                        src="/skillpilot-logo.png"
                                        alt="SkillPilot Logo"
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                </div>
                            </div>
                            <span className="text-2xl font-bold">
                                <span className="text-blue-400">Skill</span>
                                <span className="text-orange-500">Pilot</span>
                            </span>
                        </div>

                        {/* Botones de navegación */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-md border border-blue-500 px-5 py-2 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/10"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Contenido principal */}
                <div className="flex w-full flex-1 items-center justify-center px-6 py-12">
                    <div className="w-full max-w-7xl space-y-12">
                        {/* Título principal - Ancho completo */}
                        <div className="text-center pb-20">
                            <div className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400 mb-6">
                                Búsqueda de Empleo con IA
                            </div>
                            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl xl:text-7xl">
                                Encuentra Tu <span className="text-orange-500">Trabajo Ideal</span> Con Asistencia de IA
                            </h1>
                        </div>

                        {/* Contenido secundario - Grid */}
                        <div className="flex flex-col-reverse gap-12 lg:flex-row">
                            {/* Columna izquierda - Descripción y botones */}
                            <div className="flex-1 space-y-6">
                                <p className="max-w-2xl text-lg text-slate-300 md:text-xl">
                                    SkillPilot utiliza IA avanzada para conectarte con ofertas de trabajo adaptadas a tus preferencias y te
                                    ayuda a optimizar tus candidaturas para aumentar tus posibilidades de éxito.
                                </p>
                                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40"
                                    >
                                        Comenzar
                                    </Link>
                                    <a
                                        href="#features"
                                        className="inline-block rounded-md border border-slate-700 px-6 py-3 text-center text-slate-300 transition-colors hover:bg-slate-800"
                                    >
                                        Saber Más
                                    </a>
                                </div>
                            </div>

                            {/* Columna derecha - Ilustración */}
                            <div className="flex-1 relative flex flex-col justify-center">
                                <div className="absolute -z-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute -z-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl top-1/3 left-1/3"></div>

                                {/* Formas decorativas */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-orange-500/20 rounded-lg blur-xl"></div>
                                    <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 backdrop-blur-sm">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-white">Optimiza tu búsqueda de empleo con IA</h3>
                                        </div>
                                        <p className="text-slate-300 mb-6">
                                            SkillPilot analiza miles de ofertas de trabajo para encontrar las que mejor se adaptan a tu perfil profesional.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-full">Inteligencia Artificial</span>
                                            <span className="inline-block px-3 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded-full">Optimización de CV</span>
                                            <span className="inline-block px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">Búsqueda Personalizada</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Características */}
                <section id="features" className="container mx-auto w-full max-w-7xl px-6 py-16">
                    <div className="text-center mb-12">
                        <div className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-400 mb-4">
                            Características
                        </div>
                        <h2 className="text-3xl font-bold md:text-4xl">Cómo Te Ayuda SkillPilot</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-slate-300">
                            Nuestra plataforma combina tecnología de IA con experiencia en búsqueda de empleo para darte ventaja en tu carrera profesional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors">
                            <div className="h-12 w-12 text-orange-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Búsqueda Personalizada</h3>
                            <p className="text-slate-300">
                                Nuestra IA analiza tus habilidades, experiencia y preferencias para encontrar las oportunidades laborales más relevantes.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors">
                            <div className="h-12 w-12 text-orange-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Optimización de CV</h3>
                            <p className="text-slate-300">
                                Recibe sugerencias impulsadas por IA para mejorar tu currículum y aumentar tus posibilidades de conseguir entrevistas.
                            </p>
                        </div>

                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-orange-500/50 transition-colors">
                            <div className="h-12 w-12 text-orange-500 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Mejora de Candidaturas</h3>
                            <p className="text-slate-300">
                                Nuestra IA te ayuda a redactar cartas de presentación convincentes y a prepararte para entrevistas con orientación personalizada.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="container mx-auto w-full max-w-7xl px-6 py-16">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute -z-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-0 right-0"></div>
                        <div className="absolute -z-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl bottom-0 left-0"></div>

                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl font-bold md:text-4xl mb-6">¿Listo para Impulsar tu Búsqueda de Empleo?</h2>
                            <p className="text-slate-300 text-lg mb-8">
                                Únete a miles de personas que han encontrado su trabajo ideal con la plataforma impulsada por IA de SkillPilot.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-md bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-center font-medium text-white shadow-lg shadow-orange-500/30 transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-600/40"
                                >
                                    Crear Cuenta Gratis
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-md border border-blue-500 px-6 py-3 text-center text-blue-400 transition-colors hover:bg-blue-500/10"
                                >
                                    Iniciar Sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-slate-800 py-8">
                    <div className="container mx-auto w-full max-w-7xl px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center gap-2 mb-4 md:mb-0">
                                <span className="text-xl font-bold">
                                    <span className="text-blue-400">Skill</span>
                                    <span className="text-orange-500">Pilot</span>
                                </span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                                <a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a>
                                <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                                <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
                                <a href="#" className="hover:text-white transition-colors">Contacto</a>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} SkillPilot. Todos los derechos reservados.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
