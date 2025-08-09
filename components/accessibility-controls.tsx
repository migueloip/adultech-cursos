"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Accessibility, Volume2, VolumeX, Sun, Moon } from "lucide-react"

export function AccessibilityControls() {
  const [fontSize, setFontSize] = useState("normal")
  const [speechEnabled, setSpeechEnabled] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Cargar configuraciones desde localStorage al montar el componente
  useEffect(() => {
    const savedFontSize = localStorage.getItem("adultech-font-size") || "normal"
    const savedSpeechEnabled = localStorage.getItem("adultech-speech-enabled") === "true"
    const savedDarkMode = localStorage.getItem("adultech-dark-mode") === "true"

    setFontSize(savedFontSize)
    setSpeechEnabled(savedSpeechEnabled)
    setDarkMode(savedDarkMode)
  }, [])

  // Aplicar tamaño de fuente
  useEffect(() => {
    const root = document.documentElement
    switch (fontSize) {
      case "large":
        root.style.fontSize = "120%"
        break
      case "extra-large":
        root.style.fontSize = "140%"
        break
      default:
        root.style.fontSize = "100%"
    }
    localStorage.setItem("adultech-font-size", fontSize)
  }, [fontSize])

  // Aplicar modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("adultech-dark-mode", darkMode.toString())
  }, [darkMode])

  // Guardar configuración de voz
  useEffect(() => {
    localStorage.setItem("adultech-speech-enabled", speechEnabled.toString())
  }, [speechEnabled])

  const speakText = (text: string) => {
    if (speechEnabled && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const handleTextClick = (e: React.MouseEvent) => {
    if (speechEnabled) {
      const target = e.target as HTMLElement
      const text = target.textContent || target.innerText
      if (text) {
        speakText(text)
      }
    }
  }

  useEffect(() => {
    if (speechEnabled) {
      document.addEventListener("click", handleTextClick as any)
    } else {
      document.removeEventListener("click", handleTextClick as any)
    }

    return () => {
      document.removeEventListener("click", handleTextClick as any)
    }
  }, [speechEnabled])

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full p-6 shadow-2xl border-2 border-white dark:border-slate-700 transform hover:scale-110 transition-all duration-300 w-16 h-16"
        size="lg"
      >
        <Accessibility className="h-28 w-28 text-white" />
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-64 border-2 border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 shadow-xl">
          <CardContent className="p-4">
            <h4 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">Accesibilidad</h4>

            <div className="space-y-4">
              {/* Modo Oscuro/Claro */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Tema:</label>
                <Button
                  variant={darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-full ${
                    darkMode
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {darkMode ? (
                    <>
                      <Moon className="mr-2 h-4 w-4 text-white" />
                      <span className="text-white">Modo Oscuro</span>
                    </>
                  ) : (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Modo Claro
                    </>
                  )}
                </Button>
              </div>

              {/* Tamaño de texto */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                  Tamaño de texto:
                </label>
                <div className="space-y-2">
                  <Button
                    variant={fontSize === "normal" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFontSize("normal")}
                    className={`w-full ${
                      fontSize === "normal"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className={fontSize === "normal" ? "text-white" : ""}>Normal</span>
                  </Button>
                  <Button
                    variant={fontSize === "large" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFontSize("large")}
                    className={`w-full ${
                      fontSize === "large"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className={fontSize === "large" ? "text-white" : ""}>Grande</span>
                  </Button>
                  <Button
                    variant={fontSize === "extra-large" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFontSize("extra-large")}
                    className={`w-full ${
                      fontSize === "extra-large"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className={fontSize === "extra-large" ? "text-white" : ""}>Muy Grande</span>
                  </Button>
                </div>
              </div>

              {/* Narración */}
              <div>
                <Button
                  variant={speechEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className={`w-full ${
                    speechEnabled
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-transparent border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {speechEnabled ? (
                    <>
                      <VolumeX className="mr-2 h-4 w-4 text-white" />
                      <span className="text-white">Desactivar Narración</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      Activar Narración
                    </>
                  )}
                </Button>
                {speechEnabled && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Haz clic en cualquier texto para escucharlo
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
