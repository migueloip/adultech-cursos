"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Save, X, Home, AlertTriangle } from "lucide-react"
import { supabase, isSupabaseConfigured, cursosRespaldo, type Curso } from "@/lib/supabase"

export function AdminDashboard() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    icono: "Smartphone",
    color: "bg-green-100 border-green-300",
    icon_color: "text-green-600",
    video_url: "",
    pasos: [{ titulo: "", descripcion: "", imagen_url: "" }],
  })

  useEffect(() => {
    fetchCursos()
  }, [])

  const fetchCursos = async () => {
    if (!isSupabaseConfigured) {
      setCursos(cursosRespaldo)
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from("cursos").select("*").order("id")

    if (error) {
      console.error("Error fetching cursos:", error)
      setCursos(cursosRespaldo)
    } else {
      setCursos(data || cursosRespaldo)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSupabaseConfigured) {
      alert("Base de datos no configurada. No se pueden guardar cambios.")
      return
    }

    setLoading(true)

    try {
      let cursoData
      if (editingCurso) {
        // Actualizar curso existente
        const { data, error } = await supabase
          .from("cursos")
          .update({
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            icono: formData.icono,
            color: formData.color,
            icon_color: formData.icon_color,
            video_url: formData.video_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingCurso.id)
          .select()
          .single()

        if (error) throw error
        cursoData = data
      } else {
        // Crear nuevo curso
        const { data, error } = await supabase
          .from("cursos")
          .insert({
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            icono: formData.icono,
            color: formData.color,
            icon_color: formData.icon_color,
            video_url: formData.video_url,
          })
          .select()
          .single()

        if (error) throw error
        cursoData = data
      }

      // Eliminar pasos existentes si estamos editando
      if (editingCurso) {
        await supabase.from("curso_pasos").delete().eq("curso_id", editingCurso.id)
      }

      // Insertar nuevos pasos
      if (formData.pasos.length > 0 && formData.pasos[0].titulo) {
        const pasosToInsert = formData.pasos.map((paso, index) => ({
          curso_id: cursoData.id,
          orden: index + 1,
          titulo: paso.titulo,
          descripcion: paso.descripcion,
          imagen_url:
            paso.imagen_url || `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(paso.titulo)}`,
        }))

        const { error: pasosError } = await supabase.from("curso_pasos").insert(pasosToInsert)

        if (pasosError) throw pasosError
      }

      // Resetear formulario
      setFormData({
        titulo: "",
        descripcion: "",
        icono: "Smartphone",
        color: "bg-green-100 border-green-300",
        icon_color: "text-green-600",
        video_url: "",
        pasos: [{ titulo: "", descripcion: "", imagen_url: "" }],
      })
      setShowCreateForm(false)
      setEditingCurso(null)
      fetchCursos()
    } catch (error) {
      console.error("Error saving curso:", error)
      alert("Error al guardar el curso")
    }
    setLoading(false)
  }

  const handleEdit = async (curso: Curso) => {
    if (!isSupabaseConfigured) {
      alert("Base de datos no configurada. No se pueden editar cursos.")
      return
    }

    // Cargar pasos del curso
    const { data: pasos } = await supabase.from("curso_pasos").select("*").eq("curso_id", curso.id).order("orden")

    setEditingCurso(curso)
    setFormData({
      titulo: curso.titulo,
      descripcion: curso.descripcion,
      icono: curso.icono,
      color: curso.color,
      icon_color: curso.icon_color,
      video_url: curso.video_url || "",
      pasos:
        pasos && pasos.length > 0
          ? pasos.map((p) => ({ titulo: p.titulo, descripcion: p.descripcion, imagen_url: p.imagen_url || "" }))
          : [{ titulo: "", descripcion: "", imagen_url: "" }],
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!isSupabaseConfigured) {
      alert("Base de datos no configurada. No se pueden eliminar cursos.")
      return
    }

    if (confirm("¿Estás seguro de que quieres eliminar este curso?")) {
      const { error } = await supabase.from("cursos").delete().eq("id", id)

      if (error) {
        console.error("Error deleting curso:", error)
        alert("Error al eliminar el curso")
      } else {
        fetchCursos()
      }
    }
  }

  const addPaso = () => {
    setFormData((prev) => ({
      ...prev,
      pasos: [...prev.pasos, { titulo: "", descripcion: "", imagen_url: "" }],
    }))
  }

  const removePaso = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pasos: prev.pasos.filter((_, i) => i !== index),
    }))
  }

  const updatePaso = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      pasos: prev.pasos.map((paso, i) => (i === index ? { ...paso, [field]: value } : paso)),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-600 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/images/adultech-logo.png" alt="AdulTech Logo" width={40} height={40} className="rounded-lg" />
            <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              asChild
              variant="outline"
              className="bg-transparent border-slate-600 text-white hover:bg-slate-700 hover:text-white"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Ir al Sitio
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Database Status Warning */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-900/50 border-b border-yellow-700 p-4">
          <div className="container mx-auto flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <p className="text-yellow-200">
              <strong>Modo de demostración:</strong> Base de datos no configurada. Los cambios no se guardarán.
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6">
        {/* Create/Edit Form */}
        {showCreateForm && (
          <Card className="mb-8 bg-slate-800 dark:bg-slate-900 border-slate-700 dark:border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">{editingCurso ? "Editar Curso" : "Crear Nuevo Curso"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="titulo" className="text-white">
                      Título del Curso
                    </Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
                      className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="icono" className="text-white">
                      Ícono
                    </Label>
                    <Select
                      value={formData.icono}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, icono: value }))}
                    >
                      <SelectTrigger className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500">
                        <SelectItem value="Smartphone" className="text-white hover:bg-slate-600">
                          Smartphone
                        </SelectItem>
                        <SelectItem value="Phone" className="text-white hover:bg-slate-600">
                          Phone
                        </SelectItem>
                        <SelectItem value="MessageSquare" className="text-white hover:bg-slate-600">
                          MessageSquare
                        </SelectItem>
                        <SelectItem value="Wifi" className="text-white hover:bg-slate-600">
                          Wifi
                        </SelectItem>
                        <SelectItem value="Camera" className="text-white hover:bg-slate-600">
                          Camera
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion" className="text-white">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                    className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500 text-white placeholder:text-slate-400"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color" className="text-white">
                      Color de Fondo
                    </Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
                    >
                      <SelectTrigger className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500">
                        <SelectItem value="bg-green-100 border-green-300" className="text-white hover:bg-slate-600">
                          Verde
                        </SelectItem>
                        <SelectItem value="bg-blue-100 border-blue-300" className="text-white hover:bg-slate-600">
                          Azul
                        </SelectItem>
                        <SelectItem value="bg-purple-100 border-purple-300" className="text-white hover:bg-slate-600">
                          Púrpura
                        </SelectItem>
                        <SelectItem value="bg-emerald-100 border-emerald-300" className="text-white hover:bg-slate-600">
                          Esmeralda
                        </SelectItem>
                        <SelectItem value="bg-orange-100 border-orange-300" className="text-white hover:bg-slate-600">
                          Naranja
                        </SelectItem>
                        <SelectItem value="bg-pink-100 border-pink-300" className="text-white hover:bg-slate-600">
                          Rosa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="icon_color" className="text-white">
                      Color del Ícono
                    </Label>
                    <Select
                      value={formData.icon_color}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, icon_color: value }))}
                    >
                      <SelectTrigger className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500">
                        <SelectItem value="text-green-600" className="text-white hover:bg-slate-600">
                          Verde
                        </SelectItem>
                        <SelectItem value="text-blue-600" className="text-white hover:bg-slate-600">
                          Azul
                        </SelectItem>
                        <SelectItem value="text-purple-600" className="text-white hover:bg-slate-600">
                          Púrpura
                        </SelectItem>
                        <SelectItem value="text-emerald-600" className="text-white hover:bg-slate-600">
                          Esmeralda
                        </SelectItem>
                        <SelectItem value="text-orange-600" className="text-white hover:bg-slate-600">
                          Naranja
                        </SelectItem>
                        <SelectItem value="text-pink-600" className="text-white hover:bg-slate-600">
                          Rosa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="video_url" className="text-white">
                    URL del Video (Opcional)
                  </Label>
                  <Input
                    id="video_url"
                    value={formData.video_url}
                    onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
                    className="bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500 text-white placeholder:text-slate-400"
                    placeholder="https://ejemplo.com/video.mp4"
                  />
                </div>

                {/* Pasos del Curso */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-white text-lg">Pasos del Curso</Label>
                    <Button
                      type="button"
                      onClick={addPaso}
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-slate-600 text-white hover:bg-slate-700 hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Paso
                    </Button>
                  </div>

                  {formData.pasos.map((paso, index) => (
                    <Card
                      key={index}
                      className="mb-4 bg-slate-700 dark:bg-slate-800 border-slate-600 dark:border-slate-500"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-white font-medium">Paso {index + 1}</h4>
                          {formData.pasos.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => removePaso(index)}
                              variant="outline"
                              size="sm"
                              className="bg-transparent border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-white">Título del Paso</Label>
                            <Input
                              value={paso.titulo}
                              onChange={(e) => updatePaso(index, "titulo", e.target.value)}
                              className="bg-slate-600 dark:bg-slate-700 border-slate-500 dark:border-slate-400 text-white placeholder:text-slate-400"
                              placeholder="Ej: Paso 1: Ubicar el botón de encendido"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Descripción</Label>
                            <Textarea
                              value={paso.descripcion}
                              onChange={(e) => updatePaso(index, "descripcion", e.target.value)}
                              className="bg-slate-600 dark:bg-slate-700 border-slate-500 dark:border-slate-400 text-white placeholder:text-slate-400"
                              rows={3}
                              placeholder="Descripción detallada del paso..."
                            />
                          </div>
                          <div>
                            <Label className="text-white">URL de Imagen (Opcional)</Label>
                            <Input
                              value={paso.imagen_url}
                              onChange={(e) => updatePaso(index, "imagen_url", e.target.value)}
                              className="bg-slate-600 dark:bg-slate-700 border-slate-500 dark:border-slate-400 text-white placeholder:text-slate-400"
                              placeholder="https://ejemplo.com/imagen.jpg"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading || !isSupabaseConfigured}
                    className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {editingCurso ? "Actualizar Curso" : "Crear Curso"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingCurso(null)
                      setFormData({
                        titulo: "",
                        descripcion: "",
                        icono: "Smartphone",
                        color: "bg-green-100 border-green-300",
                        icon_color: "text-green-600",
                        video_url: "",
                        pasos: [{ titulo: "", descripcion: "", imagen_url: "" }],
                      })
                    }}
                    variant="outline"
                    className="bg-transparent border-slate-600 text-white hover:bg-slate-700 hover:text-white"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Gestión de Cursos</h2>
          {!showCreateForm && (
            <Button
              onClick={() => setShowCreateForm(true)}
              disabled={!isSupabaseConfigured}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Curso
            </Button>
          )}
        </div>

        {/* Cursos List */}
        <div className="grid gap-6">
          {cursos.map((curso) => (
            <Card key={curso.id} className="bg-slate-800 dark:bg-slate-900 border-slate-700 dark:border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{curso.titulo}</h3>
                    <p className="text-slate-300 dark:text-slate-400 mb-4">{curso.descripcion}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 dark:text-slate-500">
                      <span>Ícono: {curso.icono}</span>
                      <span>Color: {curso.color}</span>
                      <span>Creado: {new Date(curso.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleEdit(curso)}
                      variant="outline"
                      size="sm"
                      disabled={!isSupabaseConfigured}
                      className="bg-transparent border-slate-600 text-white hover:bg-slate-700 hover:text-white disabled:opacity-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(curso.id)}
                      variant="outline"
                      size="sm"
                      disabled={!isSupabaseConfigured}
                      className="bg-transparent border-red-600 text-red-400 hover:bg-red-600 hover:text-white disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {cursos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 dark:text-slate-500 text-xl">No hay cursos creados aún.</p>
            <p className="text-slate-500 dark:text-slate-600 mt-2">
              {isSupabaseConfigured
                ? 'Haz clic en "Crear Nuevo Curso" para comenzar.'
                : "Configura la base de datos para crear cursos."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
