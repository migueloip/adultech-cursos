'use client'

import React, { useEffect, useState } from 'react'

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: PWAProviderProps) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [showOfflineNotification, setShowOfflineNotification] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Mark as mounted to prevent hydration mismatch
    setIsMounted(true)
    setIsClient(true)
    
    // Set initial online status only on client
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope)
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  if (confirm('Nueva versión disponible. ¿Desea actualizar?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error)
        })
    }

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Don't show if already dismissed in this session
      if (!sessionStorage.getItem('install-dismissed')) {
        setShowInstallPrompt(true)
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
          setShowInstallPrompt(false)
        }, 10000)
      }
    }

    const handleAppInstalled = () => {
      console.log('AdulTech PWA was installed')
      setShowInstallPrompt(false)
    }

    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineNotification(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineNotification(true)
      
      // Auto-hide offline notification after 5 seconds
      setTimeout(() => {
        setShowOfflineNotification(false)
      }, 5000)
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt')
      }
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismissInstall = () => {
    setShowInstallPrompt(false)
    sessionStorage.setItem('install-dismissed', 'true')
  }

  return (
    <>
      {children}
      
      {/* Only render PWA UI after mounting to prevent hydration mismatch */}
      {isMounted && (
        <>
          {/* Install Prompt */}
          {showInstallPrompt && (
            <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 text-center z-50 font-sans">
              <span className="mr-4">📱 Instala AdulTech en tu dispositivo para acceso rápido</span>
              <button
                onClick={handleInstall}
                className="bg-white text-blue-600 border-none px-4 py-2 rounded mr-2 cursor-pointer font-bold"
              >
                Instalar
              </button>
              <button
                onClick={handleDismissInstall}
                className="bg-transparent text-white border border-white px-4 py-2 rounded cursor-pointer"
              >
                Ahora no
              </button>
            </div>
          )}
          
          {/* Offline Notification */}
          {showOfflineNotification && (
            <div className="fixed bottom-5 left-5 right-5 bg-amber-500 text-white p-3 rounded-lg text-center z-50 font-sans shadow-lg">
              📡 Sin conexión - Los cursos descargados siguen disponibles
            </div>
          )}
        </>
      )}
    </>
  )
}