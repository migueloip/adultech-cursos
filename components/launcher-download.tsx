"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Smartphone, ExternalLink, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface GitHubRelease {
  tag_name: string
  name: string
  published_at: string
  assets: {
    name: string
    browser_download_url: string
    size: number
  }[]
}

// Fallback release data when GitHub API is unavailable
const FALLBACK_RELEASE: GitHubRelease = {
  tag_name: "v1.0.0",
  name: "AdulTech Launcher v1.0.0",
  published_at: "2024-01-01T00:00:00Z",
  assets: [
    {
      name: "adultech-launcher.apk",
      browser_download_url: "https://github.com/migueloip/adultech_launcher-original/releases/latest/download/adultech-launcher.apk",
      size: 25000000
    }
  ]
}

export function LauncherDownload() {
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    fetchLatestRelease()
  }, [])

  const fetchLatestRelease = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setUsingFallback(false)
      
      const response = await fetch(
        'https://api.github.com/repos/migueloip/adultech_launcher-original/releases/latest'
      )
      
      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json().catch(() => ({}))
          if (errorData.message && errorData.message.includes('rate limit')) {
            throw new Error('RATE_LIMIT_EXCEEDED')
          }
          throw new Error('FORBIDDEN_ACCESS')
        }
        if (response.status === 404) {
          throw new Error('Repositorio no encontrado o no tiene releases disponibles')
        }
        throw new Error(`SERVER_ERROR_${response.status}`)
      }
      
      const release: GitHubRelease = await response.json()
      setLatestRelease(release)
    } catch (err) {
      console.error('Error fetching release:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener la última versión'
      
      // Use fallback data for rate limiting or network issues
      if (err instanceof Error && (err.message === 'RATE_LIMIT_EXCEEDED' || err.message === 'FORBIDDEN_ACCESS' || err.message.startsWith('SERVER_ERROR_'))) {
        console.log('Using fallback release data due to API limitations')
        setLatestRelease(FALLBACK_RELEASE)
        setUsingFallback(true)
        setError(null)
        
        let userMessage = 'Mostrando información de respaldo. La descarga seguirá funcionando.'
        if (err.message === 'RATE_LIMIT_EXCEEDED') {
          userMessage = 'Límite de solicitudes de GitHub excedido. Mostrando información de respaldo.'
        }
        
        toast.info(userMessage)
      } else {
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!latestRelease) return
    
    // Buscar el archivo APK en los assets
    const apkAsset = latestRelease.assets.find(asset => 
      asset.name.toLowerCase().endsWith('.apk')
    )
    
    if (!apkAsset) {
      toast.error('No se encontró el archivo APK en la release')
      return
    }
    
    setIsDownloading(true)
    
    try {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a')
      link.href = apkAsset.browser_download_url
      link.download = apkAsset.name
      link.target = '_blank'
      
      // Agregar al DOM, hacer clic y remover
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success('¡Descarga iniciada! Revisa tu carpeta de descargas')
    } catch (err) {
      console.error('Error downloading:', err)
      toast.error('Error al iniciar la descarga')
    } finally {
      setIsDownloading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-4 rounded-full bg-blue-100 dark:bg-blue-900/40">
          <Smartphone className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
          AdulTech Launcher
        </CardTitle>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Interfaz simplificada para tu teléfono Android
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Descripción */}
        <div className="text-center space-y-4">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            El <strong>AdulTech Launcher</strong> transforma tu teléfono Android en una interfaz 
            súper fácil de usar, diseñada especialmente para adultos mayores.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Botones grandes y claros</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Contactos de emergencia</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Modo oscuro/claro</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Texto ajustable</span>
            </div>
          </div>
        </div>

        {/* Información de la release */}
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-slate-600 dark:text-slate-300">Verificando última versión...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button onClick={fetchLatestRelease} variant="outline" size="sm">
              Intentar de nuevo
            </Button>
          </div>
        ) : latestRelease ? (
          <div className="space-y-4">
            {usingFallback && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  ⚠️ Mostrando información de respaldo. La descarga sigue disponible.
                </p>
              </div>
            )}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-800 dark:text-white">
                  Versión más reciente:
                </span>
                <Badge className="bg-green-600 text-white">
                  {latestRelease.tag_name}
                </Badge>
              </div>
              
              {latestRelease.assets.find(asset => asset.name.toLowerCase().endsWith('.apk')) && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">Tamaño:</span>
                  <span className="text-slate-800 dark:text-white">
                    {formatFileSize(latestRelease.assets.find(asset => asset.name.toLowerCase().endsWith('.apk'))!.size)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">Publicado:</span>
                <span className="text-slate-800 dark:text-white">
                  {formatDate(latestRelease.published_at)}
                </span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading || !latestRelease.assets.find(asset => asset.name.toLowerCase().endsWith('.apk'))}
                className="flex-1 text-lg py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                size="lg"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Descargando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Descargar APK
                  </>
                )}
              </Button>
              
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1 sm:flex-initial"
              >
                <a 
                  href="https://github.com/migueloip/adultech_launcher-original" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver en GitHub
                </a>
              </Button>
            </div>
          </div>
        ) : null}

        {/* Instrucciones de instalación */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">
            📱 Instrucciones de Instalación
          </h4>
          <ol className="space-y-3 text-blue-700 dark:text-blue-300">
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <span>Descarga el archivo APK haciendo clic en el botón de arriba</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <span>Ve a Configuración → Seguridad → Permitir instalación de fuentes desconocidas</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <span>Abre el archivo descargado y sigue las instrucciones de instalación</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                4
              </span>
              <span>Una vez instalado, presiona el botón "Inicio" de tu teléfono</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                5
              </span>
              <span>Ve a Configuración → Aplicaciones → Aplicaciones predeterminadas → Aplicación de inicio</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                6
              </span>
              <span>Selecciona "AdulTech Launcher" como tu launcher predeterminado del teléfono</span>
            </li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}