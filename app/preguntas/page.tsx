import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, HelpCircle } from "lucide-react"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { SpeechButton } from "@/components/speech-button"

const preguntas = [
  {
    pregunta: "¿Qué pasa si me equivoco al usar el teléfono?",
    respuesta:
      "No te preocupes, equivocarse es parte del aprendizaje. Los teléfonos están diseñados para ser seguros. Si cometes un error, generalmente puedes presionar el botón 'Atrás' o reiniciar la aplicación. Recuerda que siempre puedes repetir los cursos las veces que necesites.",
  },
  {
    pregunta: "¿Qué hago si se me olvida algo de lo que aprendí?",
    respuesta:
      "Es completamente normal olvidar algunos pasos. Por eso nuestros cursos están disponibles las 24 horas del día. Puedes volver a ver los videos y repasar los pasos cuantas veces quieras. También puedes tomar notas mientras aprendes.",
  },
  {
    pregunta: "¿Es seguro usar mi teléfono para estas funciones?",
    respuesta:
      "Sí, todas las funciones que enseñamos son completamente seguras. Te mostramos solo las características básicas y esenciales del teléfono. Siempre te daremos consejos de seguridad cuando sea necesario.",
  },
  {
    pregunta: "¿Necesito conocimientos previos de tecnología?",
    respuesta:
      "No necesitas ningún conocimiento previo. Nuestros cursos están diseñados para personas que nunca han usado un teléfono inteligente. Comenzamos desde lo más básico y avanzamos paso a paso.",
  },
  {
    pregunta: "¿Qué hago si mi teléfono se ve diferente al del video?",
    respuesta:
      "Aunque los teléfonos pueden verse ligeramente diferentes, los conceptos básicos son los mismos. Si tu teléfono se ve muy diferente, puedes contactarnos y te ayudaremos a adaptar las instrucciones a tu modelo específico.",
  },
  {
    pregunta: "¿Puedo practicar sin miedo a romper algo?",
    respuesta:
      "¡Absolutamente! Los teléfonos modernos son muy resistentes a errores de usuario. Las funciones básicas que enseñamos no pueden dañar tu teléfono. Practica con confianza y sin miedo.",
  },
  {
    pregunta: "¿Cómo puedo pedir ayuda si tengo problemas?",
    respuesta:
      "Puedes contactarnos a través de nuestro formulario de contacto, o pedir ayuda a un familiar. También puedes repetir los cursos o consultar esta sección de preguntas frecuentes cuando lo necesites.",
  },
  {
    pregunta: "¿Los cursos funcionan en todos los teléfonos Android?",
    respuesta:
      "Sí, nuestros cursos están diseñados para funcionar en la mayoría de teléfonos Android. Aunque algunos detalles pueden variar ligeramente, los conceptos principales son universales.",
  },
]

export default function PreguntasPage() {
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
              <HelpCircle className="h-16 w-16 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">Preguntas Frecuentes</h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Aquí encontrarás respuestas a las dudas más comunes. Recuerda que no hay preguntas tontas, ¡todos estamos
              aprendiendo!
            </p>
          </div>

          <Card className="border-2 border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-slate-800/80">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="space-y-4">
                {preguntas.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border-2 border-green-200 dark:border-green-700 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-lg md:text-xl font-semibold text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-6">
                      {item.pregunta}
                    </AccordionTrigger>
                    <AccordionContent className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed pb-6">
                      <p className="mb-4">{item.respuesta}</p>
                      <SpeechButton text={`${item.pregunta}. ${item.respuesta}`} />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-700">
              <CardContent className="p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
                  ¿No encontraste tu respuesta?
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  No te preocupes, estamos aquí para ayudarte. Puedes contactarnos directamente y te responderemos lo
                  antes posible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="text-lg bg-green-600 hover:bg-green-700">
                    <Link href="/contacto">Contactar Soporte</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-lg bg-white dark:bg-slate-700 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-600"
                  >
                    <Link href="/cursos">Ver Cursos</Link>
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
