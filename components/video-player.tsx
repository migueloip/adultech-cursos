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
  const [videoAspectRatio, setVideoAspectRatio] = useState<string>('aspect-video')
  const [videoDimensions, setVideoDimensions] = useState<{width: number, height: number} | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar tipo de dispositivo
  useEffect(() => {
    const checkDevice = () => {
      // Detectar si es móvil basado en el ancho de pantalla y user agent
      const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

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

  // Función para calcular el aspect ratio basado en las dimensiones del video
  const calculateAspectRatio = (width: number, height: number) => {
    const ratio = width / height
    
    // Si es video vertical (más alto que ancho)
    if (ratio < 0.8) {
      return 'aspect-[9/16]' // Formato vertical típico de teléfonos
    }
    // Si es video cuadrado o casi cuadrado
    else if (ratio >= 0.8 && ratio <= 1.2) {
      return 'aspect-square'
    }
    // Si es video horizontal estándar
    else if (ratio > 1.2 && ratio <= 1.8) {
      return 'aspect-video' // 16:9 estándar
    }
    // Si es video muy ancho (ultrawide)
    else {
      return 'aspect-[21/9]'
    }
  }

  // Función para obtener el tamaño máximo del contenedor según el dispositivo
  const getMaxContainerSize = () => {
    if (isMobile) {
      // En móviles, permitir que use todo el ancho disponible
      return 'max-w-full'
    } else {
      // En laptops/desktop, limitar el tamaño para que no sobrepase la pantalla
      // Usar diferentes tamaños según la orientación del video
      if (videoDimensions) {
        const ratio = videoDimensions.width / videoDimensions.height
        if (ratio < 0.8) {
          // Videos verticales: tamaño más pequeño en desktop
          return 'max-w-md'
        } else if (ratio >= 0.8 && ratio <= 1.2) {
          // Videos cuadrados: tamaño medio
          return 'max-w-lg'
        } else {
          // Videos horizontales: tamaño estándar
          return 'max-w-2xl'
        }
      }
      return 'max-w-2xl' // Tamaño por defecto
    }
  }

  // Detectar dimensiones del video cuando se carga
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current
      setVideoDimensions({ width: videoWidth, height: videoHeight })
      const newAspectRatio = calculateAspectRatio(videoWidth, videoHeight)
      setVideoAspectRatio(newAspectRatio)
    }
  }

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
            // YouTube Player - mantiene aspect-video por defecto ya que no podemos detectar dimensiones
            <div className={`aspect-video ${getMaxContainerSize()} mx-auto`}>
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
            // Video Local con aspect ratio dinámico
            <div className={`${videoAspectRatio} ${getMaxContainerSize()} mx-auto`}>
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={() => setIsMuted(videoRef.current?.muted || false)}
                onLoadedMetadata={handleVideoLoadedMetadata}
                controls={false} // Controlamos los controles manualmente
                muted={isMuted}
                preload="metadata" // Carga metadatos pero no reproduce automáticamente
              >
                Tu navegador no soporta la etiqueta de video.
              </video>
            </div>
          )
        ) : (
          // Video Placeholder si no hay URL
          <div className={`aspect-video ${getMaxContainerSize()} mx-auto bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center`}>
            <div className="text-center text-white px-4">
              <div className="text-6xl mb-4">📱</div>
              <h4 className="text-2xl font-bold mb-2">Video Tutorial</h4>
              <p className="text-lg opacity-80">Curso {courseId}: Aprende paso a paso</p>
              <p className="text-sm opacity-60 mt-2">Video no disponible</p>
              <p className="text-xs opacity-50 mt-4">El reproductor se adapta automáticamente a videos verticales y horizontales</p>
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

          <div className="text-white text-base sm:text-lg font-medium text-center sm:text-right">
            <div>
              {isYouTube && !youtubeReady ? "Cargando..." : (isPlaying ? "Reproduciendo..." : "Pausado")}
            </div>
            {videoDimensions && !isYouTube && (
              <div className="text-sm text-slate-300 mt-1">
                {videoDimensions.width}×{videoDimensions.height} 
                {videoDimensions.width < videoDimensions.height ? "(Vertical)" : 
                 videoDimensions.width === videoDimensions.height ? "(Cuadrado)" : "(Horizontal)"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
