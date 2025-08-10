"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { extractYouTubeId, isYouTubeUrl, getYouTubeEmbedUrl } from "@/lib/video-utils"

interface VideoPlayerProps {
  courseId: string
  videoUrl?: string
}

// Declarar el tipo para la API de YouTube
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function VideoPlayer({ courseId, videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const youtubePlayerRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isYouTube, setIsYouTube] = useState(false)
  const [youtubeId, setYoutubeId] = useState<string | null>(null)
  const [youtubeReady, setYoutubeReady] = useState(false)

  // Detectar si es video de YouTube
  useEffect(() => {
    if (videoUrl) {
      const isYT = isYouTubeUrl(videoUrl)
      setIsYouTube(isYT)
      if (isYT) {
        const id = extractYouTubeId(videoUrl)
        setYoutubeId(id)
      }
    }
  }, [videoUrl])

  // Cargar API de YouTube si es necesario
  useEffect(() => {
    if (isYouTube && youtubeId && !window.YT) {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      script.async = true
      document.body.appendChild(script)

      window.onYouTubeIframeAPIReady = () => {
        setYoutubeReady(true)
      }
    } else if (isYouTube && youtubeId && window.YT) {
      setYoutubeReady(true)
    }
  }, [isYouTube, youtubeId])

  // Inicializar player de YouTube
  useEffect(() => {
    if (youtubeReady && youtubeId && iframeRef.current && !youtubePlayerRef.current) {
      youtubePlayerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: youtubeId,
        playerVars: {
          controls: 0, // Ocultar controles nativos
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          fs: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
          autohide: 1
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true)
            } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false)
            }
          }
        }
      })
    }
  }, [youtubeReady, youtubeId])

  const handlePlayPause = async () => {
    if (isYouTube && youtubePlayerRef.current) {
      // Control para YouTube
      if (isPlaying) {
        youtubePlayerRef.current.pauseVideo()
      } else {
        youtubePlayerRef.current.playVideo()
      }
    } else if (videoRef.current) {
      // Control para video local
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
    if (isYouTube && youtubePlayerRef.current) {
      // Control de mute para YouTube
      if (isMuted) {
        youtubePlayerRef.current.unMute()
        setIsMuted(false)
      } else {
        youtubePlayerRef.current.mute()
        setIsMuted(true)
      }
    } else if (videoRef.current) {
      // Control de mute para video local
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative">
        {videoUrl ? (
          isYouTube && youtubeId ? (
            // YouTube Player
            <div className="aspect-video">
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=0&autohide=1`}
                title="Video Tutorial de YouTube"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            // Video Local
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
          )
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
            <Button 
              onClick={handlePlayPause} 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isYouTube && !youtubeReady}
            >
              {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>

            <Button 
              onClick={handleMute} 
              variant="ghost" 
              size="lg" 
              className="text-white hover:bg-white/20"
              disabled={isYouTube && !youtubeReady}
            >
              {isMuted ? <VolumeX className="h-5 w-5 sm:h-6 sm:w-6" /> : <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />}
            </Button>
          </div>

          <div className="text-white text-base sm:text-lg font-medium">
            {isYouTube && !youtubeReady ? "Cargando..." : (isPlaying ? "Reproduciendo..." : "Pausado")}
          </div>
        </div>
      </div>
    </div>
  )
}
