import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Sesión cerrada exitosamente' },
      { status: 200 }
    )
    
    // Eliminar la cookie de sesión
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Expira inmediatamente
    })
    
    return response
  } catch (err) {
    return NextResponse.json(
      { error: 'Error cerrando sesión' },
      { status: 500 }
    )
  }
}