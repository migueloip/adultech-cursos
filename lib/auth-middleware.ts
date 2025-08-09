import { NextRequest } from 'next/server'

export interface AdminSession {
  authenticated: boolean
  adminId: number
  username: string
  timestamp: number
}

export function validateAdminSession(request: NextRequest): AdminSession | null {
  try {
    const sessionCookie = request.cookies.get('admin_session')
    
    if (!sessionCookie) {
      return null
    }

    const session: AdminSession = JSON.parse(sessionCookie.value)
    
    // Verificar que la sesión sea válida y no haya expirado (24 horas)
    const now = Date.now()
    const sessionAge = now - session.timestamp
    const maxAge = 24 * 60 * 60 * 1000 // 24 horas en milisegundos
    
    if (!session.authenticated || sessionAge > maxAge) {
      return null
    }
    
    return session
  } catch (error) {
    console.error('Error validating admin session:', error)
    return null
  }
}

export function requireAdminAuth(request: NextRequest): AdminSession {
  const session = validateAdminSession(request)
  
  if (!session) {
    throw new Error('Unauthorized: Admin authentication required')
  }
  
  return session
}