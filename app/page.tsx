import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Heart, Users, Zap, ArrowRight } from "lucide-react"
import { AccessibilityControls } from "@/components/accessibility-controls"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <AccessibilityControls />

      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-orange-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/adultech-logo.png"
                alt="AdulTech Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">AdulTech Cursos</h1>
            </div>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Inicio
              </Link>
              <Link
                href="/cursos"
                className="text-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Cursos
              </Link>
              <Link
                href="/preguntas"
                className="text-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Preguntas
              </Link>
              <Link
                href="/contacto"
                className="text-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                Contacto
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Simplificado y más intuitivo */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto">
            {/* Logo grande centrado */}
            <div className="mb-8">
              <Image
                src="/images/adultech-logo.png"
                alt="AdulTech - Aprende tecnología"
                width={150}
                height={150}
                className="mx-auto rounded-2xl shadow-lg"
              />
            </div>

            <h2 className="text-5xl md:text-7xl font-bold text-slate-800 dark:text-white mb-8 leading-tight">
              Aprende a usar tu
              <span className="text-blue-600 dark:text-blue-400 block"> teléfono Android</span>
            </h2>

            <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Cursos fáciles y paso a paso, diseñados especialmente para ti.
              <span className="block mt-2 text-green-600 dark:text-green-400 font-semibold">
                ¡Sin prisa, a tu ritmo!
              </span>
            </p>

            {/* Un solo botón principal muy visible */}
            <div className="mb-16">
              <Button
                asChild
                size="lg"
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl px-6 sm:px-8 md:px-12 py-6 md:py-8 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-2xl transform hover:scale-105 transition-all duration-300 w-full max-w-md mx-auto"
              >
                <Link href="/cursos" className="flex items-center justify-center">
                  <BookOpen className="mr-2 sm:mr-3 md:mr-4 h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                  <span className="whitespace-nowrap">Comenzar a Aprender</span>
                  <ArrowRight className="ml-2 sm:ml-3 md:ml-4 h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                </Link>
              </Button>
            </div>

            {/* Mensaje de confianza */}
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-8 border-2 border-green-200 dark:border-green-700 max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed">
                <Heart className="inline h-6 w-6 text-red-500 mr-2" />
                <strong>No te preocupes si eres principiante.</strong> Nuestros cursos están hechos con mucho cariño
                para que aprendas sin estrés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Simplificado */}
      <section className="py-16 bg-white/50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h3 className="text-4xl md:text-5xl font-bold text-center text-slate-800 dark:text-white mb-16">
            ¿Por qué AdulTech?
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-green-200 dark:border-green-700 bg-green-50/50 dark:bg-green-900/20 transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <Zap className="h-20 w-20 text-green-600 dark:text-green-400 mx-auto mb-6" />
                <h4 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">Súper Fácil</h4>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Todo explicado con palabras simples e imágenes grandes
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20 transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <Users className="h-20 w-20 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
                <h4 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">Sin Prisa</h4>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Aprende cuando quieras, repite cuantas veces necesites
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/20 transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-8 text-center">
                <Heart className="h-20 w-20 text-orange-600 dark:text-orange-400 mx-auto mb-6" />
                <h4 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">Con Amor</h4>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Hecho pensando en ti, con paciencia y comprensión
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Image src="/images/adultech-logo.png" alt="AdulTech Logo" width={50} height={50} className="rounded-lg" />
            <h4 className="text-2xl font-bold">AdulTech Cursos</h4>
          </div>
          <p className="text-lg text-slate-300 mb-6">Tecnología accesible para todos los adultos mayores</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-8">
            <Link href="/cursos" className="text-lg hover:text-blue-400">
              Cursos
            </Link>
            <Link href="/preguntas" className="text-lg hover:text-blue-400">
              Preguntas Frecuentes
            </Link>
            <Link href="/contacto" className="text-lg hover:text-blue-400">
              Contacto
            </Link>
            <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-400">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
