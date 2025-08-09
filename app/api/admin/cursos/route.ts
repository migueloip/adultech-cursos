import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth-middleware'

// GET - Obtener todos los cursos (público)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cursos')
      .select('*')
      .order('id')

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching cursos:', error)
    return NextResponse.json(
      { error: 'Error al obtener cursos' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo curso (requiere autenticación admin)
export async function POST(request: NextRequest) {
  try {
    // Validar autenticación de admin
    const adminSession = requireAdminAuth(request)
    
    const body = await request.json()
    const { titulo, descripcion, icono, color, icon_color, video_url } = body

    if (!titulo || !descripcion) {
      return NextResponse.json(
        { error: 'Título y descripción son requeridos' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('cursos')
      .insert({
        titulo,
        descripcion,
        icono: icono || 'Smartphone',
        color: color || 'bg-green-100 border-green-300',
        icon_color: icon_color || 'text-green-600',
        video_url: video_url || '',
      })
      .select()

    if (error) throw error

    return NextResponse.json({ 
      data: data[0],
      message: 'Curso creado exitosamente'
    })
  } catch (error: any) {
    console.error('Error creating curso:', error)
    
    if (error.message === 'Unauthorized: Admin authentication required') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al crear curso' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar curso existente (requiere autenticación admin)
export async function PUT(request: NextRequest) {
  try {
    // Validar autenticación de admin
    const adminSession = requireAdminAuth(request)
    
    const body = await request.json()
    const { id, titulo, descripcion, icono, color, icon_color, video_url } = body

    if (!id || !titulo || !descripcion) {
      return NextResponse.json(
        { error: 'ID, título y descripción son requeridos' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('cursos')
      .update({
        titulo,
        descripcion,
        icono,
        color,
        icon_color,
        video_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      data: data[0],
      message: 'Curso actualizado exitosamente'
    })
  } catch (error: any) {
    console.error('Error updating curso:', error)
    
    if (error.message === 'Unauthorized: Admin authentication required') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al actualizar curso' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar curso (requiere autenticación admin)
export async function DELETE(request: NextRequest) {
  try {
    // Validar autenticación de admin
    const adminSession = requireAdminAuth(request)
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID del curso es requerido' },
        { status: 400 }
      )
    }

    // Primero eliminar los pasos del curso
    const { error: pasosError } = await supabaseAdmin
      .from('curso_pasos')
      .delete()
      .eq('curso_id', id)

    if (pasosError) throw pasosError

    // Luego eliminar el curso
    const { error } = await supabaseAdmin
      .from('cursos')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ 
      message: 'Curso eliminado exitosamente'
    })
  } catch (error: any) {
    console.error('Error deleting curso:', error)
    
    if (error.message === 'Unauthorized: Admin authentication required') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar curso' },
      { status: 500 }
    )
  }
}