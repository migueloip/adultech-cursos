"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Heart, Send } from "lucide-react"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { Turnstile } from "@marsidev/react-turnstile"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    relacion: "",
    mensaje: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!turnstileToken) {
      alert("Por favor, completa la verificación de seguridad.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Enviar datos a la función Edge de Supabase
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nombre,
          email: formData.email,
          phone: formData.telefono,
          relationship: formData.relacion,
          message: formData.mensaje,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar el mensaje')
      }

      const result = await response.json()
      console.log('Email enviado:', result)
      setIsSubmitted(true)
    } catch (err) {
      console.error('Error enviando formulario:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="max-w-2xl mx-4 border-2 border-green-200 dark:border-green-700 bg-white/90 dark:bg-slate-800/90">
          <CardContent className="p-12 text-center">
            <div className="mx-auto mb-6 p-4 rounded-full bg-green-100 dark:bg-green-900 w-fit">
              <Heart className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">¡Mensaje Enviado!</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
              Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible. Nuestro equipo
              está aquí para ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/">Volver al Inicio</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600"
              >
                <Link href="/cursos">Ver Cursos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <div className="mx-auto mb-6 p-4 rounded-full bg-blue-100 dark:bg-blue-900 w-fit">
              <Mail className="h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">Contáctanos</h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              ¿Necesitas ayuda? ¿Tienes alguna sugerencia? Estamos aquí para apoyarte en tu aprendizaje tecnológico.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-2 border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/80">
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl text-center text-slate-800 dark:text-white">
                  Envíanos un Mensaje
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="nombre" className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      Nombre Completo *
                    </Label>
                    <Input
                      id="nombre"
                      type="text"
                      required
                      className="mt-2 text-lg p-4 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Escribe tu nombre completo"
                      value={formData.nombre}
                      onChange={(e) => handleInputChange("nombre", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      Correo Electrónico *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="mt-2 text-lg p-4 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefono" className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      Teléfono (Opcional)
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      className="mt-2 text-lg p-4 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      placeholder="Tu número de teléfono"
                      value={formData.telefono}
                      onChange={(e) => handleInputChange("telefono", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="relacion" className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      ¿Quién eres? *
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("relacion", value)}>
                      <SelectTrigger className="mt-2 text-lg p-4 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adulto-mayor">Soy un adulto mayor</SelectItem>
                        <SelectItem value="hijo">Soy hijo/hija</SelectItem>
                        <SelectItem value="nieto">Soy nieto/nieta</SelectItem>
                        <SelectItem value="familiar">Soy otro familiar</SelectItem>
                        <SelectItem value="cuidador">Soy cuidador/a</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="mensaje" className="text-lg font-medium text-slate-700 dark:text-slate-300">
                      Tu Mensaje *
                    </Label>
                    <Textarea
                      id="mensaje"
                      required
                      rows={6}
                      className="mt-2 text-lg p-4 border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white resize-none"
                      placeholder="Cuéntanos cómo podemos ayudarte. Describe tu duda, problema o sugerencia con el mayor detalle posible."
                      value={formData.mensaje}
                      onChange={(e) => handleInputChange("mensaje", e.target.value)}
                    />
                  </div>

                  {/* Cloudflare Turnstile Captcha */}
                  <div className="flex justify-center">
                    <Turnstile
                      siteKey="0x4AAAAAABoYJsi_L3gpLKr1"
                      onSuccess={(token) => setTurnstileToken(token)}
                      onError={() => setTurnstileToken(null)}
                      onExpire={() => setTurnstileToken(null)}
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full text-xl py-6 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || !turnstileToken}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-3 h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-3 h-6 w-6" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <Card className="border-2 border-orange-200 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <Heart className="h-12 w-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Nuestro Compromiso</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                      Nos comprometemos a responder todos los mensajes en un plazo máximo de 24 horas. Tu aprendizaje es
                      nuestra prioridad.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 text-center">
                    Consejos para tu Mensaje
                  </h3>
                  <ul className="space-y-3 text-lg text-slate-600 dark:text-slate-300">
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      Describe tu problema con detalle
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      Menciona qué curso estás tomando
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      Incluye el modelo de tu teléfono si es relevante
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                      No dudes en hacer cualquier pregunta
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
