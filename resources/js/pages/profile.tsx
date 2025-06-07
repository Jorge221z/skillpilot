import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Upload, FileText, User, Code, Plus, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/profile',
    },
];

export default function Profile() {
    const { props } = usePage<{
        flash?: {
            success?: string;
            error?: string;
        };
    }>();
    const [technologies, setTechnologies] = useState<string[]>(['']);
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        cv_file: null as File | null,
        desired_position: '',
        technologies: [] as string[],
    });

    // Manejar mensajes flash de Laravel
    useEffect(() => {
        if (props.flash?.success) {
            setMessage({ type: 'success', text: props.flash.success });
        }
        if (props.flash?.error) {
            setMessage({ type: 'error', text: props.flash.error });
        }
    }, [props.flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setMessage({ type: 'error', text: 'Por favor selecciona un archivo PDF.' });
            return;
        }

        // Filtrar tecnologías vacías
        const validTechnologies = technologies.filter(tech => tech.trim() !== '');

        // Crear FormData para enviar archivo
        const formData = new FormData();
        formData.append('cv_file', selectedFile);
        formData.append('desired_position', data.desired_position);

        validTechnologies.forEach((tech, index) => {
            formData.append(`technologies[${index}]`, tech);
        });

        // Usar router.post para enviar FormData
        router.post('/profile/process-cv', formData, {
            onStart: () => {
                setMessage(null);
                setIsProcessing(true);
            },
            onFinish: () => {
                setIsProcessing(false);
            },
            onSuccess: () => {
                setSelectedFile(null);
                reset();
                setTechnologies(['']);
            },
            onError: (errors) => {
                console.error('Errores:', errors);
                setMessage({ type: 'error', text: 'Error al procesar el CV. Por favor, revisa los datos e inténtalo de nuevo.' });
            }
        });
    };

    const handleFileSelect = (file: File) => {
        if (file.type === 'application/pdf') {
            setSelectedFile(file);
            setMessage(null);
        } else {
            setMessage({ type: 'error', text: 'Por favor selecciona un archivo PDF válido.' });
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
    };

    const addTechnology = () => {
        setTechnologies([...technologies, '']);
    };

    const removeTechnology = (index: number) => {
        if (technologies.length > 1) {
            const newTechnologies = technologies.filter((_, i) => i !== index);
            setTechnologies(newTechnologies);
        }
    };

    const updateTechnology = (index: number, value: string) => {
        const newTechnologies = [...technologies];
        newTechnologies[index] = value;
        setTechnologies(newTechnologies);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                <Card className="w-full max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Configurar Perfil
                        </CardTitle>
                        <CardDescription>
                            Sube tu CV y completa tu información profesional para obtener recomendaciones personalizadas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {message && (
                            <Alert className={`mb-4 ${message.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-green-500 bg-green-50 dark:bg-green-950'}`}>
                                <AlertDescription className={message.type === 'error' ? 'text-red-700 dark:text-red-200' : 'text-green-700 dark:text-green-200'}>
                                    {message.text}
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Upload CV */}
                            <div className="space-y-2">
                                <Label htmlFor="cv_file" className="text-sm font-medium">
                                    Subir CV (PDF) *
                                </Label>
                                <div
                                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                        dragOver
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                    }`}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                >
                                    <input
                                        type="file"
                                        id="cv_file"
                                        accept=".pdf"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileSelect(file);
                                        }}
                                        className="sr-only"
                                    />
                                    <label
                                        htmlFor="cv_file"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        {selectedFile ? (
                                            <div className="flex items-center gap-2 text-sm">
                                                <FileText className="h-4 w-4" />
                                                <span className="font-medium">{selectedFile.name}</span>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                <span className="font-medium">Haz clic para subir</span> o arrastra tu CV aquí
                                                <br />
                                                Solo archivos PDF (máx. 10MB)
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {errors.cv_file && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.cv_file}</p>
                                )}
                            </div>

                            {/* Desired Position */}
                            <div className="space-y-2">
                                <Label htmlFor="desired_position" className="text-sm font-medium">
                                    Posición Deseada
                                </Label>
                                <Input
                                    id="desired_position"
                                    type="text"
                                    placeholder="ej. Desarrollador Frontend Senior"
                                    value={data.desired_position}
                                    onChange={(e) => setData('desired_position', e.target.value)}
                                />
                                {errors.desired_position && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.desired_position}</p>
                                )}
                            </div>

                            {/* Technologies */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Code className="h-4 w-4" />
                                    Tecnologías
                                </Label>
                                <div className="space-y-2">
                                    {technologies.map((tech, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                type="text"
                                                placeholder="ej. React, TypeScript, Laravel..."
                                                value={tech}
                                                onChange={(e) => updateTechnology(index, e.target.value)}
                                                className="flex-1"
                                            />
                                            {technologies.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => removeTechnology(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addTechnology}
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Agregar Tecnología
                                    </Button>
                                </div>
                                {errors.technologies && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.technologies}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isProcessing || !selectedFile}
                            >
                                {isProcessing ? 'Procesando...' : 'Guardar Perfil'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
