import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar si existe la cookie de sesión
    const sessionCookie = request.cookies.get('admin_session')
    
    if (sessionCookie && sessionCookie.value === 'authenticated') {
      return NextResponse.json(
        { authenticated: true },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      )
    }
  } catch (err) {
    return NextResponse.json(
      { authenticated: false, error: 'Error verificando sesión' },
      { status: 500 }
    )
  }
}