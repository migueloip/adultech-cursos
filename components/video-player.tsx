"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoPlayerProps {
  courseId: string
  videoUrl?: string
}

export function VideoPlayer({ courseId, videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        try {
          const playPromise = videoRef.current.play()
          if (playPromise !== undefined) {
            await playPromise
            setIsPlaying(true)
          }
        } catch (error) {
          console.log('El video ha sido interrumpido:', error)
          setIsPlaying(false)
        }
      }
    }
  }

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative">
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full aspect-video"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onVolumeChange={() => setIsMuted(videoRef.current?.muted || false)}
            controls={false} // Controlamos los controles manualmente
            muted={isMuted}
            preload="metadata" // Carga metadatos pero no reproduce automáticamente
          >
            Tu navegador no soporta la etiqueta de video.
          </video>
        ) : (
          // Video Placeholder si no hay URL
          <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">📱</div>
              <h4 className="text-2xl font-bold mb-2">Video Tutorial</h4>
              <p className="text-lg opacity-80">Curso {courseId}: Aprende paso a paso</p>
              <p className="text-sm opacity-60 mt-2">Video no disponible</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Controls - Separados y debajo del video */}
      <div className="bg-slate-800 dark:bg-slate-900 p-4 border-t border-slate-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Button onClick={handlePlayPause} size="lg" className="bg-blue-600 hover:bg-blue-700">
              {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>

            <Button onClick={handleMute} variant="ghost" size="lg" className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" /> : <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
          </div>

          <div className="text-white text-base sm:text-lg font-medium">
            {isPlaying ? "Reproduciendo..." : "Pausado"}
          </div>
        </div>
      </div>
    </div>
  )
}
