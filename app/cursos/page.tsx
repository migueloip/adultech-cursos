import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Play, Smartphone, Phone, MessageSquare, Wifi, Camera } from "lucide-react"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { supabase, isSupabaseConfigured, cursosRespaldo, pasosRespaldo, type Curso } from "@/lib/supabase"
import { CourseProgressIndicator } from "@/components/course-progress-indicator"

const iconMap = {
  Smartphone,
  Phone,
  MessageSquare,
  Wifi,
  Camera,
}

// Extender el tipo Curso para incluir el conteo de pasos
type CursoWithStepCount = Curso & {
  total_pasos: number
}

async function getCursos(): Promise<CursoWithStepCount[]> {
  let cursos: Curso[] = []
  const pasosCounts: { [cursoId: number]: number } = {}

  if (!isSupabaseConfigured) {
    console.log("Usando datos de respaldo - Supabase no configurado")
    cursos = cursosRespaldo
    // Calcular pasos para datos de respaldo
    cursos.forEach((curso) => {
      pasosCounts[curso.id] = pasosRespaldo[curso.id]?.length || 0
    })
  } else {
    try {
      const { data, error } = await supabase.from("cursos").select("*").order("id")
      if (error) {
        console.error("Error fetching cursos:", error)
        cursos = cursosRespaldo
      } else {
        cursos = data || cursosRespaldo
      }

      // Obtener el conteo de pasos para cada curso
      const { data: pasosData, error: pasosError } = await supabase
        .from("curso_pasos")
        .select("curso_id", { count: "exact" })

      if (pasosError) {
        console.error("Error fetching pasos count:", pasosError)
        // Fallback a conteo de pasos de respaldo si hay error
        cursos.forEach((curso) => {
          pasosCounts[curso.id] = pasosRespaldo[curso.id]?.length || 0
        })
      } else {
        // Agrupar por curso_id y contar
        pasosData.forEach((paso: { curso_id: number }) => {
          pasosCounts[paso.curso_id] = (pasosCounts[paso.curso_id] || 0) + 1
        })
      }
    } catch (error) {
      console.error("Database connection error:", error)
      cursos = cursosRespaldo
      cursos.forEach((curso) => {
        pasosCounts[curso.id] = pasosRespaldo[curso.id]?.length || 0
      })
    }
  }

  // Combinar cursos con su conteo de pasos
  return cursos.map((curso) => ({
    ...curso,
    total_pasos: pasosCounts[curso.id] || 0,
  }))
}

export default async function CursosPage() {
  const cursos = await getCursos()

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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">AdulTech Cursos</h1>
            </div>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base sm:text-lg bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 w-full sm:w-auto"
            >
              <Link href="/" className="flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="whitespace-nowrap">Volver al Inicio</span>
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">Nuestros Cursos</h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Cada curso está diseñado para que aprendas de forma gradual y sin prisa. Puedes repetir las lecciones
              cuantas veces necesites.
            </p>
            {!isSupabaseConfigured && (
              <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ℹ️ Modo de demostración - Los cursos funcionan con datos de ejemplo
                </p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {cursos.map((curso) => {
              const IconComponent = iconMap[curso.icono as keyof typeof iconMap] || Smartphone
              return (
                <Card
                  key={curso.id}
                  className={`${curso.color} dark:bg-slate-800 border-2 hover:shadow-lg transition-shadow`}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 rounded-full bg-white/80 dark:bg-slate-700/80">
                      <IconComponent className={`h-12 w-12 ${curso.icon_color}`} />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                      {curso.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      {curso.descripcion}
                    </p>
                    <Button asChild size="lg" className="w-full text-lg py-3">
                      <Link href={`/cursos/${curso.id}`}>
                        <Play className="mr-2 h-5 w-5" />
                        Comenzar Curso
                      </Link>
                    </Button>
                    <CourseProgressIndicator courseId={curso.id} totalSteps={curso.total_pasos} />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Help Section */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-slate-800/80 border-2 border-blue-200 dark:border-blue-700">
              <CardContent className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                  ¿Necesitas ayuda?
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  Si tienes dudas o necesitas apoyo adicional, no dudes en contactarnos. Estamos aquí para ayudarte.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-lg bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600"
                  >
                    <Link href="/preguntas">Ver Preguntas Frecuentes</Link>
                  </Button>
                  <Button asChild size="lg" className="text-lg">
                    <Link href="/contacto">Contactar Soporte</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
