"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Shield } from "lucide-react"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Contraseña de producción - cambiar por una más segura
    if (password === "admin123") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Contraseña incorrecta")
    }
  }

  if (isAuthenticated) {
    return <AdminDashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-slate-700 bg-slate-800/90">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-blue-100 w-fit">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Panel de Administración</CardTitle>
          <p className="text-slate-300">Ingresa la contraseña para acceder</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                placeholder="Ingresa la contraseña"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Lock className="mr-2 h-4 w-4" />
              Acceder
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
