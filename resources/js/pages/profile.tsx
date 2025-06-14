"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Head, useForm, router, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Upload, FileText, User, Code, Plus, X, Edit, Save, Trash } from "lucide-react"
import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Profile",
    href: "/profile",
  },
]

interface UserProfile {
  id: number
  desired_position: string | null
  skills: string[] | null
  parsed_cv: string | null
  cv_filename: string | null
  created_at: string
  updated_at: string
}

export default function Profile() {
  const { props } = usePage<{
    userProfile?: UserProfile
    flash?: {
      success?: string
      error?: string
    }
  }>()

  const [isEditing, setIsEditing] = useState(false)
  const [skills, setSkills] = useState<string[]>([""])
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { data, setData, post, processing, errors, reset } = useForm({
    cv_file: null as File | null,
    desired_position: "",
    skills: [] as string[],
  })

  useEffect(() => {
    if (props.userProfile) {
      setData({
        cv_file: null,
        desired_position: props.userProfile.desired_position || "",
        skills: props.userProfile.skills || [],
      })
      setSkills(props.userProfile.skills || [""])
    }
  }, [props.userProfile])

  useEffect(() => {
    if (props.flash?.success) {
      toast.success(props.flash.success, {
        duration: 4000,
      })
    }
    if (props.flash?.error) {
      toast.error(props.flash.error, {
        duration: 5000,
      })
    }
  }, [props.flash])

  const handleEditToggle = () => {
    if (isEditing) {
      if (props.userProfile) {
        setData({
          cv_file: null,
          desired_position: props.userProfile.desired_position || "",
          skills: props.userProfile.skills || [],
        })
        setSkills(props.userProfile.skills || [""])
      }
      setSelectedFile(null)
    }
    setIsEditing(!isEditing)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    const validSkills = skills.filter((tech) => tech.trim() !== "")

    if (selectedFile) {
      const formData = new FormData()
      formData.append("cv_file", selectedFile)
      formData.append("desired_position", data.desired_position)

      validSkills.forEach((tech, index) => {
        formData.append(`skills[${index}]`, tech)
      })

      router.post("/profile/process-cv", formData, {
        onStart: () => {
          setIsProcessing(true)
        },
        onFinish: () => {
          setIsProcessing(false)
        },
        onSuccess: () => {
          setSelectedFile(null)
          setIsEditing(false)
        },
        onError: (errors) => {
          console.error("Errores:", errors)
          toast.error("Error al procesar el nuevo CV. Por favor, revisa los datos e inténtalo de nuevo.")
        },
      })
    } else {
      router.put(
        "/profile/update",
        {
          desired_position: data.desired_position,
          skills: validSkills,
        },
        {
          onStart: () => {
            setIsProcessing(true)
          },
          onFinish: () => {
            setIsProcessing(false)
          },
          onSuccess: () => {
            setIsEditing(false)
          },
          onError: (errors) => {
            console.error("Errores:", errors)
            toast.error("Error al actualizar el perfil.")
          },
        },
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error("Por favor selecciona un archivo PDF.")
      return
    }

    const validSkills = skills.filter((tech) => tech.trim() !== "")

    const formData = new FormData()
    formData.append("cv_file", selectedFile)
    formData.append("desired_position", data.desired_position)

    validSkills.forEach((tech, index) => {
      formData.append(`skills[${index}]`, tech)
    })

    router.post("/profile/process-cv", formData, {
      onStart: () => {
        setIsProcessing(true)
      },
      onFinish: () => {
        setIsProcessing(false)
      },
      onSuccess: () => {
        setSelectedFile(null)
        reset()
        setSkills([""])
        setIsEditing(false)
      },
      onError: (errors) => {
        console.error("Errores:", errors)
        toast.error("Error al procesar el CV. Por favor, revisa los datos e inténtalo de nuevo.")
      },
    })
  }

  const handleFileSelect = (file: File) => {
    if (file.type === "application/pdf") {
      setSelectedFile(file)
    } else {
      toast.error("Por favor selecciona un archivo PDF válido.")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const addTechnology = () => {
    setSkills([...skills, ""])
  }

  const removeTechnology = (index: number) => {
    if (skills.length > 1) {
      const newSkills = skills.filter((_, i) => i !== index)
      setSkills(newSkills)
    }
  }

  const updateTechnology = (index: number, value: string) => {
    const newSkills = [...skills]
    newSkills[index] = value
    setSkills(newSkills)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Profile" />
      <div className="min-h-screen bg-gray-100 dark:bg-neutral-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 border-b-4 border-b-teal-500 pb-4">
              <User className="h-8 w-8 text-teal-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil Profesional</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              {props.userProfile
                ? "Gestiona tu información profesional y preferencias"
                : "Configura tu perfil para obtener recomendaciones personalizadas"}
            </p>
          </div>

          <Card className="w-full max-w-3xl mx-auto shadow-lg bg-white dark:bg-gray-800/50">
            <CardContent className="p-8 space-y-6">
              {/* Reading View */}
              {props.userProfile && !isEditing ? (
                <div className="space-y-8">
                  {/* Desired Position */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white">Puesto Deseado</Label>
                    </div>
                    <div className="pl-5">
                      <p className="text-gray-900 dark:text-white font-medium text-lg">
                        {props.userProfile.desired_position || "No especificada"}
                      </p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Habilidades y Tecnologías
                      </Label>
                    </div>
                    <div className="pl-5">
                      <div className="flex flex-wrap gap-2">
                        {props.userProfile.skills && props.userProfile.skills.length > 0 ? (
                          props.userProfile.skills.map((tech, index) => (
                            <Badge
                              key={index}
                              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-1"
                            >
                              {tech}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 italic">No hay habilidades especificadas</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* CV Info */}
                  {props.userProfile.parsed_cv && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <Label className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Curriculum Vitae
                        </Label>
                      </div>
                      <div className="pl-5">
                        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {props.userProfile.cv_filename || "CV procesado exitosamente"}
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Procesado el {new Date(props.userProfile.updated_at).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Button */}
                  <div className="flex justify-center pt-8 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="button"
                      onClick={handleEditToggle}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3"
                      size="lg"
                    >
                      <Edit className="h-5 w-5 mr-2" />
                      Editar Perfil
                    </Button>
                  </div>
                </div>
              ) : isEditing ? (
                /* Edit Form */
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Upload New CV */}
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                      Actualizar CV (Opcional)
                    </Label>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                        Si deseas actualizar tu CV, sube un nuevo archivo. Si no, se mantendrá el actual.
                      </p>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          dragOver
                            ? "border-teal-400 bg-teal-50 dark:bg-teal-900/30"
                            : "border-gray-300 dark:border-gray-600 hover:border-teal-400"
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
                            const file = e.target.files?.[0]
                            if (file) handleFileSelect(file)
                          }}
                          className="sr-only"
                        />
                        <label htmlFor="cv_file_edit" className="cursor-pointer flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-teal-500" />
                          {selectedFile ? (
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium text-teal-600 dark:text-teal-400">Haz clic para subir</span>{" "}
                              o arrastra un archivo
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
                          className="mt-3"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Quitar archivo
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Desired Position */}
                  <div className="space-y-2">
                    <Label htmlFor="desired_position" className="text-lg font-semibold text-gray-900 dark:text-white">
                      Puesto Deseado
                    </Label>
                    <Input
                      id="desired_position"
                      type="text"
                      placeholder="ej. Desarrollador Frontend Senior"
                      value={data.desired_position}
                      onChange={(e) => setData("desired_position", e.target.value)}
                      className="border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                    />
                    {errors.desired_position && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.desired_position}</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Habilidades y Tecnologías
                    </Label>
                    <div className="space-y-2">
                      {skills.map((tech, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder="ej. React, Python, Git..."
                            value={tech}
                            onChange={(e) => updateTechnology(index, e.target.value)}
                            className="flex-1 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                          />
                          {skills.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeTechnology(index)}
                              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:bg-neutral-900"
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
                        className="flex items-center gap-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar Habilidad
                      </Button>
                    </div>
                    {errors.skills && <p className="text-sm text-red-600 dark:text-red-400">{errors.skills}</p>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditToggle}
                      disabled={isProcessing}
                      className="px-6"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      onClick={handleUpdate}
                      disabled={isProcessing}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-6"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isProcessing
                        ? selectedFile
                          ? "Procesando CV..."
                          : "Guardando..."
                        : selectedFile
                          ? "Procesar Nuevo CV"
                          : "Guardar Cambios"}
                    </Button>
                  </div>
                </form>
              ) : (
                /* Initial Setup Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Upload CV */}
                  <div className="space-y-2">
                    <Label htmlFor="cv_file" className="text-lg font-semibold text-gray-900 dark:text-white">
                      Subir CV (PDF) *
                    </Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragOver
                          ? "border-teal-400 bg-teal-50 dark:bg-teal-900/30"
                          : "border-gray-300 dark:border-gray-600 hover:border-teal-400"
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
                          const file = e.target.files?.[0]
                          if (file) handleFileSelect(file)
                        }}
                        className="sr-only"
                      />
                      <label htmlFor="cv_file" className="cursor-pointer flex flex-col items-center gap-3">
                        <Upload className="h-12 w-12 text-teal-500" />
                        {selectedFile ? (
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-gray-900 dark:text-white">{selectedFile.name}</span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium text-teal-600 dark:text-teal-400 text-lg">
                              Haz clic para subir
                            </span>{" "}
                            o arrastra tu CV aquí
                            <br />
                            <span className="text-xs">Solo archivos PDF (máx. 10MB)</span>
                          </div>
                        )}
                      </label>
                    </div>
                    {errors.cv_file && <p className="text-sm text-red-600 dark:text-red-400">{errors.cv_file}</p>}
                  </div>

                  {/* Desired Position */}
                  <div className="space-y-2">
                    <Label htmlFor="desired_position" className="text-lg font-semibold text-gray-900 dark:text-white">
                      Posición Deseada
                    </Label>
                    <Input
                      id="desired_position"
                      type="text"
                      placeholder="ej. Desarrollador Frontend Senior"
                      value={data.desired_position}
                      onChange={(e) => setData("desired_position", e.target.value)}
                      className="border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                    />
                    {errors.desired_position && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.desired_position}</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Habilidades y Tecnologías
                    </Label>
                    <div className="space-y-2">
                      {skills.map((tech, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="text"
                            placeholder="ej. React, TypeScript, Laravel..."
                            value={tech}
                            onChange={(e) => updateTechnology(index, e.target.value)}
                            className="flex-1 border-gray-300 dark:border-gray-600 focus:border-teal-500 focus:ring-teal-500"
                          />
                          {skills.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeTechnology(index)}
                              className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
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
                        className="flex items-center gap-2 border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar Habilidad
                      </Button>
                    </div>
                    {errors.skills && <p className="text-sm text-red-600 dark:text-red-400">{errors.skills}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3"
                      disabled={isProcessing || !selectedFile}
                      size="lg"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Procesando...
                        </div>
                      ) : (
                        "Crear Perfil"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
