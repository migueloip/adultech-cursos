import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Buscar el usuario por username
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }

    // Comparar la contraseña con el hash usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, data.password_hash)
    
    if (isPasswordValid) {
      // Crear respuesta exitosa con cookie de sesión
      const response = NextResponse.json(
        { 
          success: true, 
          message: 'Autenticación exitosa',
          admin: {
            id: data.id,
            username: data.username
          }
        },
        { status: 200 }
      )
      
      // Establecer cookie de sesión administrativa
      response.cookies.set('admin_session', JSON.stringify({
        authenticated: true,
        adminId: data.id,
        username: data.username,
        timestamp: Date.now()
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 horas
      })
      
      return response
    } else {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      )
    }
  } catch (err) {
    console.error('Error en autenticación:', err)
    return NextResponse.json(
      { error: 'Error de conexión' },
      { status: 500 }
    )
  }
}