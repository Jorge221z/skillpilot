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
import { Upload, FileText, User, Code, Plus, X, Edit, Save, Trash } from 'lucide-react';

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
    cv_filename: string | null;
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

        // Si hay un nuevo CV seleccionado, procesarlo con el endpoint de procesamiento
        if (selectedFile) {
            // Crear FormData para enviar archivo
            const formData = new FormData();
            formData.append('cv_file', selectedFile);
            formData.append('desired_position', data.desired_position);

            validTechnologies.forEach((tech, index) => {
                formData.append(`technologies[${index}]`, tech);
            });

            // Usar router.post para procesar el nuevo CV
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
                    setIsEditing(false);
                },
                onError: (errors) => {
                    console.error('Errores:', errors);
                    setMessage({ type: 'error', text: 'Error al procesar el nuevo CV. Por favor, revisa los datos e inténtalo de nuevo.' });
                }
            });
        } else {
            // Solo actualizar datos sin procesar CV
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
        }
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
                        <div className="text-center">
                            <CardTitle className="flex items-center justify-center gap-3 text-primary text-2xl">
                                <User className="h-6 w-6" />
                                Mis preferencias profesionales
                            </CardTitle>
                            <CardDescription className="mt-2">
                                {props.userProfile
                                    ? 'Revisa y actualiza tu información profesional.'
                                    : 'Sube tu CV y completa tu información profesional para obtener recomendaciones personalizadas.'
                                }
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {message && (
                            <Alert className={`mb-4 ${message.type === 'error' ? 'border-destructive bg-destructive/10 dark:bg-destructive/20' : 'border-green-500 bg-green-50 dark:bg-green-950/50'}`}>
                                <AlertDescription className={message.type === 'error' ? 'text-destructive' : 'text-green-700 dark:text-green-300 font-medium'}>
                                    {message.text}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Vista de Lectura - Mostrar datos existentes */}
                        {props.userProfile && !isEditing ? (
                            <>
                                <div className="space-y-6">
                                    {/* Posición Deseada */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium text-primary">Puesto Deseado</Label>
                                    <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-l-primary mt-3">
                                        <p className="text-foreground font-medium">
                                            {props.userProfile.desired_position || 'No especificada'}
                                        </p>
                                    </div>
                                </div>
                                {/* Tecnologías */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-medium flex items-center gap-2 text-primary">
                                        <Code className="h-4 w-4" />
                                        <span className='ml-1'>Tecnologías / Habilidades</span>
                                    </Label>
                                    <div className="p-4 bg-muted/50 rounded-lg border border-primary/20">
                                        <div className="flex flex-wrap gap-2">
                                            {props.userProfile.technologies && props.userProfile.technologies.length > 0 ? (
                                                props.userProfile.technologies.map((tech, index) => (
                                                    <Badge
                                                        key={index}
                                                        className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                                    >
                                                        {tech}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <div className="p-1 bg-muted rounded-lg text-muted-foreground italic">
                                                    No hay tecnologías o habilidades especificadas
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* CV Información */}
                                {props.userProfile.parsed_cv && (
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium flex items-center gap-2 text-primary">
                                            <FileText className="h-4 w-4" />
                                            CV
                                        </Label>
                                        <div className="p-4 bg-muted/50 rounded-lg border border-primary/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {props.userProfile.cv_filename || 'CV procesado exitosamente'}
                                                    </p>
                                                    <p className="text-xs text-green-600 dark:text-green-400">
                                                        Procesado el {new Date(props.userProfile.updated_at).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center text-green-600 dark:text-green-400">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                </div>

                                {/* Botón de Editar Centrado */}
                                <div className="flex justify-center pt-6 mt-6 border-t border-border">
                                    <Button
                                        type="button"
                                        onClick={handleEditToggle}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                        size="lg"
                                    >
                                        <Edit className="h-5 w-5 mr-2" />
                                        Editar Perfil
                                    </Button>
                                </div>
                            </>
                        ) : isEditing ? (
                            /* Formulario de edición */
                            <>
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    {/* Subir Nuevo CV (Opcional) */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-primary">
                                            Subir Nuevo CV (Opcional)
                                        </Label>
                                        <div className="p-4 bg-muted/30 rounded-lg border border-primary/20">
                                            <p className="text-sm text-muted-foreground mb-3">
                                                Si deseas actualizar tu CV, puedes subir un nuevo archivo aquí. Si no subes ningún archivo, se mantendrá el CV actual.
                                            </p>
                                            <div
                                                className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                                                    dragOver
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-primary/30 hover:border-primary'
                                                }`}
                                                onDrop={handleDrop}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                            >
                                                <input
                                                    type="file"
                                                    id="cv_file_edit"
                                                    accept=".pdf"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleFileSelect(file);
                                                    }}
                                                    className="sr-only"
                                                />
                                                <label
                                                    htmlFor="cv_file_edit"
                                                    className="cursor-pointer flex flex-col items-center gap-2"
                                                >
                                                    <Upload className="h-6 w-6 text-primary" />
                                                    {selectedFile ? (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                            <span className="font-medium text-foreground">{selectedFile.name}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-muted-foreground">
                                                            <span className="font-medium text-primary">Haz clic para subir</span> o arrastra un nuevo CV aquí
                                                            <br />
                                                            <span className="text-xs">Solo archivos PDF (máx. 10MB)</span>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                            {selectedFile && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedFile(null)}
                                                    className="mt-2 border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground"
                                                >
                                                    <Trash className="h-4 w-4 mr-1" />
                                                    Quitar archivo
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Desired Position */}
                                    <div className="space-y-2">
                                        <Label htmlFor="desired_position" className="text-sm font-medium text-primary">
                                            Puesto Deseado
                                        </Label>
                                        <Input
                                            id="desired_position"
                                            type="text"
                                            placeholder="ej. Desarrollador Frontend Senior"
                                            value={data.desired_position}
                                            onChange={(e) => setData('desired_position', e.target.value)}
                                            className="border-primary/30 focus:border-primary focus:ring-primary"
                                        />
                                        {errors.desired_position && (
                                            <p className="text-sm text-destructive">{errors.desired_position}</p>
                                        )}
                                    </div>

                                    {/* Technologies */}
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium flex items-center gap-2 text-primary">
                                            <Code className="h-4 w-4" />
                                            Tecnologías / Habilidades
                                        </Label>
                                        <div className="space-y-2">
                                            {technologies.map((tech, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Input
                                                        type="text"
                                                        placeholder="ej. React, Git, Prompt engineering..."
                                                        value={tech}
                                                        onChange={(e) => updateTechnology(index, e.target.value)}
                                                        className="flex-1 border-primary/30 focus:border-primary focus:ring-primary"
                                                    />
                                                    {technologies.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => removeTechnology(index)}
                                                            className="border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addTechnology}
                                                className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Agregar
                                            </Button>
                                        </div>
                                        {errors.technologies && (
                                            <p className="text-sm text-destructive">{errors.technologies}</p>
                                        )}
                                    </div>
                                </form>

                                {/* Botones de Acción Centrados */}
                                <div className="flex justify-center gap-4 pt-6 mt-6 border-t border-border">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleEditToggle}
                                        disabled={isProcessing}
                                        className="border-muted-foreground text-muted-foreground hover:bg-muted px-6 py-2"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleUpdate}
                                        disabled={isProcessing}
                                        className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {isProcessing
                                            ? (selectedFile ? 'Procesando CV...' : 'Guardando...')
                                            : (selectedFile ? 'Procesar Nuevo CV' : 'Guardar Cambios')
                                        }
                                    </Button>
                                </div>
                            </>
                        ) : (
                            /* Formulario de creación inicial */
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Upload CV */}
                                <div className="space-y-2">
                                    <Label htmlFor="cv_file" className="text-sm font-medium text-primary">
                                        Subir CV (PDF) *
                                    </Label>
                                    <div
                                        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                            dragOver
                                                ? 'border-primary bg-primary/5'
                                                : 'border-primary/30 hover:border-primary'
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
                                            <Upload className="h-8 w-8 text-primary" />
                                            {selectedFile ? (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                    <span className="font-medium text-foreground">{selectedFile.name}</span>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-muted-foreground">
                                                    <span className="font-medium text-primary">Haz clic para subir</span> o arrastra tu CV aquí
                                                    <br />
                                                    <span className="text-xs">Solo archivos PDF (máx. 10MB)</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                    {errors.cv_file && (
                                        <p className="text-sm text-destructive">{errors.cv_file}</p>
                                    )}
                                </div>

                                {/* Desired Position */}
                                <div className="space-y-2">
                                    <Label htmlFor="desired_position" className="text-sm font-medium text-primary">
                                        Posición Deseada
                                    </Label>
                                    <Input
                                        id="desired_position"
                                        type="text"
                                        placeholder="ej. Desarrollador Frontend Senior"
                                        value={data.desired_position}
                                        onChange={(e) => setData('desired_position', e.target.value)}
                                        className="border-primary/30 focus:border-primary focus:ring-primary"
                                    />
                                    {errors.desired_position && (
                                        <p className="text-sm text-destructive">{errors.desired_position}</p>
                                    )}
                                </div>

                                {/* Technologies */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2 text-primary">
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
                                                    className="flex-1 border-primary/30 focus:border-primary focus:ring-primary"
                                                />
                                                {technologies.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => removeTechnology(index)}
                                                        className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
                                            className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Agregar Tecnología
                                        </Button>
                                    </div>
                                    {errors.technologies && (
                                        <p className="text-sm text-destructive">{errors.technologies}</p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                        disabled={isProcessing || !selectedFile}
                                        size="lg"
                                    >
                                        {isProcessing ? 'Procesando...' : 'Crear Perfil'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
