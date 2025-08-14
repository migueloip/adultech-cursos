"use client"

import { useState, useEffect, useCallback } from 'react'

interface OfflineHookReturn {
  isOnline: boolean | null
  isServiceWorkerReady: boolean
  isMounted: boolean
  cacheCourse: (courseId: number, courseData: any) => Promise<boolean>
  getCachedCourses: () => Promise<number[]>
  isCourseOffline: (courseId: number) => Promise<boolean>
}

export function useOffline(): OfflineHookReturn {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setIsMounted(true)
    
    // Verificar estado inicial de conexión solo en el cliente
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    // Escuchar cambios de conexión
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration)
          setIsServiceWorkerReady(true)
          
          // Escuchar actualizaciones del SW
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Hay una nueva versión disponible
                  console.log('Nueva versión del Service Worker disponible')
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Error registrando Service Worker:', error)
        })
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const cacheCourse = useCallback(async (courseId: number, courseData: any): Promise<boolean> => {
    if (!isServiceWorkerReady || !navigator.serviceWorker.controller) {
      console.warn('Service Worker no está listo')
      return false
    }

    try {
      // Crear un canal de comunicación con el SW
      const messageChannel = new MessageChannel()
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          const { success } = event.data
          resolve(success)
        }

        // Enviar datos del curso al SW para cachear
        navigator.serviceWorker.controller?.postMessage(
          {
            type: 'CACHE_COURSE',
            courseId,
            courseData
          },
          [messageChannel.port2]
        )
      })
    } catch (error) {
      console.error('Error cacheando curso:', error)
      return false
    }
  }, [isServiceWorkerReady])

  const getCachedCourses = useCallback(async (): Promise<number[]> => {
    if (!isServiceWorkerReady || !navigator.serviceWorker.controller) {
      return []
    }

    try {
      const messageChannel = new MessageChannel()
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          const { courseIds } = event.data
          resolve(courseIds || [])
        }

        navigator.serviceWorker.controller?.postMessage(
          { type: 'GET_CACHED_COURSES' },
          [messageChannel.port2]
        )
      })
    } catch (error) {
      console.error('Error obteniendo cursos cacheados:', error)
      return []
    }
  }, [isServiceWorkerReady])

  const isCourseOffline = useCallback(async (courseId: number): Promise<boolean> => {
    const cachedCourses = await getCachedCourses()
    return cachedCourses.includes(courseId)
  }, [getCachedCourses])

  return {
    isOnline,
    isServiceWorkerReady,
    isMounted,
    cacheCourse,
    getCachedCourses,
    isCourseOffline
  }
}