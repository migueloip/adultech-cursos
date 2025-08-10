"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, CheckCircle } from "lucide-react"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { VideoPlayer } from "@/components/video-player"
import { SpeechButton } from "@/components/speech-button"
import { processImageUrl } from "@/lib/image-utils"
import {
  supabase,
  isSupabaseConfigured,
  cursosRespaldo,
  pasosRespaldo,
  type Curso,
  type CursoPaso,
} from "@/lib/supabase"
import { notFound } from "next/navigation"
import { useState, useEffect, use } from "react"

async function getCurso(id: string): Promise<Curso | null> {
  const cursoId = Number.parseInt(id)

  if (!isSupabaseConfigured) {
    return cursosRespaldo.find((c) => c.id === cursoId) || null
  }

  try {
    const { data, error } = await supabase.from("cursos").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching curso:", error)
      return cursosRespaldo.find((c) => c.id === cursoId) || null
    }

    return data
  } catch (error) {
    console.error("Database connection error:", error)
    return cursosRespaldo.find((c) => c.id === cursoId) || null
  }
}

async function getCursoPasos(cursoId: string): Promise<CursoPaso[]> {
  const id = Number.parseInt(cursoId)

  if (!isSupabaseConfigured) {
    return pasosRespaldo[id] || []
  }

  try {
    const { data, error } = await supabase.from("curso_pasos").select("*").eq("curso_id", cursoId).order("orden")

    if (error) {
      console.error("Error fetching curso pasos:", error)
      return pasosRespaldo[id] || []
    }

    return data || pasosRespaldo[id] || []
  } catch (error) {
    console.error("Database connection error:", error)
    return pasosRespaldo[id] || []
  }
}

export default function CursoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [curso, setCurso] = useState<Curso | null>(null)
  const [pasos, setPasos] = useState<CursoPaso[]>([])
  const [loading, setLoading] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<{ [key: number]: boolean }>({})

  const courseProgressKey = `adultech-curso-${id}-progress`

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const fetchedCurso = await getCurso(id)
      const fetchedPasos = await getCursoPasos(id)
      setCurso(fetchedCurso)
      setPasos(fetchedPasos)

      // Load progress from local storage
      const savedProgress = localStorage.getItem(courseProgressKey)
      if (savedProgress) {
        setCompletedSteps(JSON.parse(savedProgress))
      }
      setLoading(false)
    }
    fetchData()
  }, [id])

  useEffect(() => {
    // Save progress to local storage whenever completedSteps changes
    localStorage.setItem(courseProgressKey, JSON.stringify(completedSteps))
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(
      new StorageEvent("storage", { key: courseProgressKey, newValue: JSON.stringify(completedSteps) }),
    )
  }, [completedSteps, courseProgressKey])

  const handleCompleteStep = (stepId: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId], // Toggle completion status
    }))
  }

  const handleResetProgress = () => {
    if (confirm("¿Estás seguro de que quieres reiniciar el progreso de este curso?")) {
      setCompletedSteps({})
      alert("Progreso del curso reiniciado.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-slate-800 dark:text-white text-xl">Cargando curso...</div>
      </div>
    )
  }

  if (!curso) {
    notFound()
  }

  const allStepsCompleted = pasos.length > 0 && pasos.every((paso) => completedSteps[paso.id])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <AccessibilityControls />

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-orange-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/adultech-logo.png"
                alt="AdulTech Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white">AdulTech Cursos</h1>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base sm:text-lg bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 w-full sm:w-auto"
            >
              <Link href="/cursos" className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="whitespace-nowrap">Volver a Cursos</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4 max-w-4xl">
          {/* Course Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 px-2">{curso.titulo}</h2>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6 px-2">{curso.descripcion}</p>
            <SpeechButton text={`${curso.titulo}. ${curso.descripcion}`} />
            {!isSupabaseConfigured && (
              <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ℹ️ Modo de demostración - Contenido de ejemplo
                </p>
              </div>
            )}
          </div>

          {/* Video Section */}
          <Card className="mb-8 sm:mb-12 border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 mx-2 sm:mx-0">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-slate-800 dark:text-white">Video Tutorial</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoPlayer courseId={id} videoUrl={curso.video_url} />
            </CardContent>
          </Card>

          {/* Steps Section */}
          {pasos.length > 0 && (
            <div className="space-y-6 sm:space-y-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-white text-center mb-6 sm:mb-8 px-2">
                Pasos a seguir
              </h3>

              {pasos.map((paso, index) => (
                <Card
                  key={paso.id}
                  className={`border-2 ${
                    completedSteps[paso.id]
                      ? "border-green-400 dark:border-green-600"
                      : "border-green-200 dark:border-green-700"
                  } bg-white/80 dark:bg-slate-800/80 mx-2 sm:mx-0`}
                >
                  <CardContent className="p-4 sm:p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
                      <div>
                        <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-white mb-3 sm:mb-4 flex items-center flex-wrap">
                          <span className="break-words">{paso.titulo}</span>
                          {completedSteps[paso.id] && (
                            <CheckCircle className="ml-2 h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                          )}
                        </h4>
                        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-4 break-words">
                          {paso.descripcion}
                        </p>
                        <SpeechButton text={`${paso.titulo}. ${paso.descripcion}`} />
                        <Button
                          onClick={() => handleCompleteStep(paso.id)}
                          variant={completedSteps[paso.id] ? "secondary" : "default"}
                          size="sm"
                          className={`mt-4 w-full text-sm sm:text-base ${
                            completedSteps[paso.id]
                              ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/30"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                          }`}
                        >
                          {completedSteps[paso.id] ? "Desmarcar como Completado" : "Marcar como Completado"}
                        </Button>
                      </div>
                      <div className="text-center order-first md:order-last">
                        <Image
                          src={processImageUrl(paso.imagen_url, paso.titulo)}
                          alt={paso.titulo}
                          width={400}
                          height={300}
                          className="rounded-lg border-2 border-slate-200 dark:border-slate-600 mx-auto w-full max-w-sm sm:max-w-md md:max-w-full h-auto"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation and Reset Progress */}
          <div className="mt-8 sm:mt-12 flex flex-col gap-3 sm:gap-4 justify-center px-2 sm:px-0">
            <Button
              onClick={handleResetProgress}
              size="default"
              variant="outline"
              className="text-sm sm:text-base bg-white dark:bg-slate-700 border-2 border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="truncate">Reiniciar Progreso del Curso</span>
            </Button>
            <Button
              asChild
              size="default"
              variant="outline"
              className="text-sm sm:text-base bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 w-full"
            >
              <Link href={`/cursos/${id}`} className="flex items-center justify-center">
                <RotateCcw className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="truncate">Repetir Curso</span>
              </Link>
            </Button>
            <Button asChild size="default" className="text-sm sm:text-base w-full">
              <Link href="/cursos" className="flex items-center justify-center">
                <span className="truncate">Ver Más Cursos</span>
              </Link>
            </Button>
          </div>

          {allStepsCompleted && pasos.length > 0 && (
            <div className="mt-8 text-center p-6 bg-green-100 dark:bg-green-900/20 border-2 border-green-400 dark:border-green-700 rounded-lg max-w-md mx-auto">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <p className="text-xl font-bold text-green-800 dark:text-green-200">
                ¡Felicidades! Has completado este curso.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
