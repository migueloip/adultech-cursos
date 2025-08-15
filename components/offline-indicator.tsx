"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Wifi, WifiOff, Check, Loader2 } from 'lucide-react'
import { useOffline } from '@/hooks/use-offline'
import { toast } from 'sonner'

interface OfflineIndicatorProps {
  courseId?: number
  courseData?: any
  showDownloadButton?: boolean
}

export function OfflineIndicator({ courseId, courseData, showDownloadButton = false }: OfflineIndicatorProps) {
  const { isOnline, isServiceWorkerReady, isMounted, cacheCourse, isCourseOffline } = useOffline()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false)

  useEffect(() => {
    if (courseId) {
      checkOfflineStatus()
    }
  }, [courseId, isServiceWorkerReady])

  const checkOfflineStatus = async () => {
    if (courseId) {
      const isAvailable = await isCourseOffline(courseId)
      setIsOfflineAvailable(isAvailable)
    }
  }

  const handleDownloadCourse = async () => {
    if (!courseId || !courseData) {
      toast.error('No se puede descargar el curso')
      return
    }

    setIsDownloading(true)
    
    try {
      const success = await cacheCourse(courseId, courseData)
      
      if (success) {
        setIsOfflineAvailable(true)
        toast.success('¡Curso descargado! Ya puedes acceder sin internet')
      } else {
        toast.error('Error al descargar el curso')
      }
    } catch (error) {
      console.error('Error descargando curso:', error)
      toast.error('Error al descargar el curso')
    } finally {
      setIsDownloading(false)
    }
  }

  // Don't render connection status until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="space-y-4">
        <Card className="border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">
                    Verificando conexión...
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Cargando estado de conexión
                  </p>
                </div>
              </div>
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Indicador de estado de conexión */}
      <Card className={`border-2 ${
        isOnline === null
          ? 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20'
          : isOnline 
          ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20' 
          : 'border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOnline === null ? (
                <Loader2 className="h-5 w-5 text-gray-600 dark:text-gray-400 animate-spin" />
              ) : isOnline ? (
                <Wifi className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <WifiOff className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              )}
              <div>
                <p className="font-medium text-slate-800 dark:text-white">
                  {isOnline === null ? 'Verificando conexión...' : isOnline ? 'Conectado a Internet' : 'Sin conexión a Internet'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isOnline === null
                    ? 'Cargando estado de conexión'
                    : isOnline 
                    ? 'Puedes acceder a todo el contenido' 
                    : 'Solo contenido descargado disponible'
                  }
                </p>
              </div>
            </div>
            
            <Badge variant={isOnline === null ? 'secondary' : isOnline ? 'default' : 'secondary'}>
              {isOnline === null ? 'Verificando...' : isOnline ? 'En línea' : 'Fuera de línea'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Botón de descarga de curso */}
      {showDownloadButton && courseId && (
        <Card className="border-2 border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-slate-800 dark:text-white mb-2">
                  Acceso sin Internet
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {isOfflineAvailable 
                    ? '✅ Este curso ya está disponible sin internet'
                    : 'Descarga este curso para acceder sin conexión'
                  }
                </p>
              </div>
              
              {!isOfflineAvailable && (
                <Button
                  onClick={handleDownloadCourse}
                  disabled={isDownloading || !isServiceWorkerReady}
                  className="ml-4"
                  size="sm"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Descargando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar
                    </>
                  )}
                </Button>
              )}
              
              {isOfflineAvailable && (
                <Badge className="ml-4 bg-green-600 text-white">
                  <Check className="mr-1 h-3 w-3" />
                  Descargado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información sobre PWA */}
      {isServiceWorkerReady && (
        <Card className="border-2 border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-medium text-slate-800 dark:text-white mb-2">
                💡 ¿Sabías que puedes instalar AdulTech cursos web?
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Instala el acceso directo de AdulTech cursos web en tu teléfono para acceder más fácilmente.
                Busca el botón "Agregar a pantalla de inicio" en tu navegador.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}