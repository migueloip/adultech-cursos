import { NextRequest, NextResponse } from 'next/server'
import { validateAdminSession } from '@/lib/auth-middleware'

export async function GET(request: NextRequest) {
  try {
    const session = validateAdminSession(request)
    
    if (session) {
      return NextResponse.json({
        authenticated: true,
        admin: {
          id: session.adminId,
          username: session.username
        }
      })
    } else {
      return NextResponse.json({
        authenticated: false
      })
    }
  } catch (error) {
    console.error('Error checking session:', error)
    return NextResponse.json(
      { authenticated: false, error: 'Error verificando sesión' },
      { status: 500 }
    )
  }
}