"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

interface SpeechButtonProps {
  text: string
}

export function SpeechButton({ text }: SpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        speechSynthesis.cancel()
        setIsSpeaking(false)
      } else {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "es-ES"
        utterance.rate = 0.8
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        speechSynthesis.speak(utterance)
      }
    }
  }

  return (
    <Button
      onClick={handleSpeak}
      variant="outline"
      size="lg"
      className="text-lg border-2 border-blue-300 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 bg-transparent text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
    >
      {isSpeaking ? (
        <>
          <VolumeX className="mr-2 h-5 w-5" />
          Detener Narración
        </>
      ) : (
        <>
          <Volume2 className="mr-2 h-5 w-5" />
          Escuchar Texto
        </>
      )}
    </Button>
  )
}
