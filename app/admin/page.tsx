"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Shield, User, LogOut } from "lucide-react"
import { AdminDashboard } from "@/components/admin-dashboard"
import { supabase } from "@/lib/supabase"

export default function AdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Verificar sesión al cargar la página
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/check')
        const result = await response.json()
        
        if (result.authenticated) {
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error('Error verificando sesión:', err)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Llamar a la API de autenticación
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setIsAuthenticated(true)
      } else {
        setError(result.error || "Credenciales incorrectas")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
      setIsAuthenticated(false)
      setEmail("")
      setPassword("")
      setError("")
    } catch (err) {
      console.error('Error cerrando sesión:', err)
    }
  }

  // Mostrar loading mientras verifica la sesión
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Verificando sesión...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div>
        <div className="bg-slate-800 p-4 flex justify-between items-center">
          <h1 className="text-white font-bold text-xl">Panel de Administración</h1>
          <Button 
            onClick={handleLogout} 
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-3 px-4"
          >
            <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            Cerrar Sesión
          </Button>
        </div>
        <AdminDashboard />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="mx-auto mb-4 p-3 sm:p-4 rounded-full bg-blue-100 w-fit">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white mb-2">
            Panel de Administración
          </CardTitle>
          <p className="text-slate-400 text-sm sm:text-base">
            Ingresa tus credenciales para acceder
          </p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white text-sm sm:text-base">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm sm:text-base"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white text-sm sm:text-base">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm sm:text-base"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            {error && (
              <p className="text-red-400 text-xs sm:text-sm">{error}</p>
            )}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm sm:text-base py-2 sm:py-3"
            >
              <Lock className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              {isLoading ? "Verificando..." : "Acceder"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
