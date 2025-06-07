import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Upload, FileText, User, Code, Plus, X, Edit, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile',
        href: '/profile',
    },
];

interface UserProfile {
    id: number;
    desired_position: string | null;
    technologies: string[] | null;
    parsed_cv: string | null;
    created_at: string;
    updated_at: string;
}

export default function Profile() {
    const { props } = usePage<{
        userProfile?: UserProfile;
        flash?: {
            success?: string;
            error?: string;
        };
    }>();

    const [isEditing, setIsEditing] = useState(false);
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

    // Inicializar datos del perfil existente
    useEffect(() => {
        if (props.userProfile) {
            setData({
                cv_file: null,
                desired_position: props.userProfile.desired_position || '',
                technologies: props.userProfile.technologies || [],
            });
            setTechnologies(props.userProfile.technologies || ['']);
        }
    }, [props.userProfile]);

    // Manejar mensajes flash de Laravel
    useEffect(() => {
        if (props.flash?.success) {
            setMessage({ type: 'success', text: props.flash.success });
        }
        if (props.flash?.error) {
            setMessage({ type: 'error', text: props.flash.error });
        }
    }, [props.flash]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancelar edición - restaurar datos originales
            if (props.userProfile) {
                setData({
                    cv_file: null,
                    desired_position: props.userProfile.desired_position || '',
                    technologies: props.userProfile.technologies || [],
                });
                setTechnologies(props.userProfile.technologies || ['']);
            }
            setSelectedFile(null);
        }
        setIsEditing(!isEditing);
        setMessage(null);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        // Filtrar tecnologías vacías
        const validTechnologies = technologies.filter(tech => tech.trim() !== '');

        router.put('/profile/update', {
            desired_position: data.desired_position,
            technologies: validTechnologies,
        }, {
            onStart: () => {
                setMessage(null);
                setIsProcessing(true);
            },
            onFinish: () => {
                setIsProcessing(false);
            },
            onSuccess: () => {
                setIsEditing(false);
            },
            onError: (errors) => {
                console.error('Errores:', errors);
                setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
            }
        });
    };

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
                setIsEditing(false);
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
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Mi Perfil Profesional
                                </CardTitle>
                                <CardDescription>
                                    {props.userProfile
                                        ? 'Revisa y actualiza tu información profesional.'
                                        : 'Sube tu CV y completa tu información profesional para obtener recomendaciones personalizadas.'
                                    }
                                </CardDescription>
                            </div>
                            {props.userProfile && (
                                <div className="flex gap-2">
                                    {isEditing ? (
                                        <>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleEditToggle}
                                                disabled={isProcessing}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={handleUpdate}
                                                disabled={isProcessing}
                                            >
                                                <Save className="h-4 w-4 mr-2" />
                                                {isProcessing ? 'Guardando...' : 'Guardar'}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleEditToggle}
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {message && (
                            <Alert className={`mb-4 ${message.type === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-green-500 bg-green-50 dark:bg-green-950'}`}>
                                <AlertDescription className={message.type === 'error' ? 'text-red-700 dark:text-red-200' : 'text-green-700 dark:text-green-200'}>
                                    {message.text}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Vista de Lectura - Mostrar datos existentes */}
                        {props.userProfile && !isEditing ? (
                            <div className="space-y-6">
                                {/* Posición Deseada */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Puesto Deseada</Label>
                                    <div className="p-3 bg-muted rounded-lg mt-2">
                                        {props.userProfile.desired_position || 'No especificada'}
                                    </div>
                                </div>

                                {/* Tecnologías */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Code className="h-4 w-4" />
                                        <span className='ml-1'>Tecnologías / Habilidades</span>
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {props.userProfile.technologies && props.userProfile.technologies.length > 0 ? (
                                            props.userProfile.technologies.map((tech, index) => (
                                                <Badge key={index} variant="secondary">
                                                    {tech}
                                                </Badge>
                                            ))
                                        ) : (
                                            <div className="p-3 bg-muted rounded-lg text-muted-foreground">
                                                No hay tecnologías especificadas
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CV Información */}
                                {props.userProfile.parsed_cv && (
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            CV Procesado
                                        </Label>
                                        <div className="p-3 bg-muted rounded-lg text-sm">
                                            <p className="text-muted-foreground">
                                                CV procesado exitosamente - {new Date(props.userProfile.updated_at).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Formulario de edición o creación inicial */
                            <form onSubmit={props.userProfile && isEditing ? handleUpdate : handleSubmit} className="space-y-6">
                                {/* Upload CV - Solo mostrar si no hay perfil existente */}
                                {!props.userProfile && (
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
                                )}

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
                                    disabled={isProcessing || (!props.userProfile && !selectedFile)}
                                >
                                    {isProcessing ?
                                        (props.userProfile && isEditing ? 'Actualizando...' : 'Procesando...') :
                                        (props.userProfile && isEditing ? 'Actualizar Perfil' : 'Guardar Perfil')
                                    }
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
