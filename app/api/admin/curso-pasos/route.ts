import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth-middleware'

// POST - Crear/actualizar pasos de un curso (requiere autenticación admin)
export async function POST(request: NextRequest) {
  try {
    // Validar autenticación de admin
    const adminSession = requireAdminAuth(request)
    
    const body = await request.json()
    const { curso_id, pasos } = body

    if (!curso_id || !Array.isArray(pasos)) {
      return NextResponse.json(
        { error: 'curso_id y pasos (array) son requeridos' },
        { status: 400 }
      )
    }

    // Eliminar pasos existentes del curso
    const { error: deleteError } = await supabaseAdmin
      .from('curso_pasos')
      .delete()
      .eq('curso_id', curso_id)

    if (deleteError) throw deleteError

    // Insertar nuevos pasos si hay alguno
    if (pasos.length > 0) {
      const pasosToInsert = pasos.map((paso: any, index: number) => ({
        curso_id: parseInt(curso_id),
        orden: index + 1,
        titulo: paso.titulo,
        descripcion: paso.descripcion,
        imagen_url: paso.imagen_url || '',
      }))

      const { data, error: insertError } = await supabaseAdmin
        .from('curso_pasos')
        .insert(pasosToInsert)
        .select()

      if (insertError) throw insertError

      return NextResponse.json({ 
        data,
        message: 'Pasos del curso actualizados exitosamente'
      })
    }

    return NextResponse.json({ 
      data: [],
      message: 'Pasos del curso eliminados exitosamente'
    })
  } catch (error: any) {
    console.error('Error managing curso pasos:', error)
    
    if (error.message === 'Unauthorized: Admin authentication required') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al gestionar pasos del curso' },
      { status: 500 }
    )
  }
}

// GET - Obtener pasos de un curso específico (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const curso_id = searchParams.get('curso_id')

    if (!curso_id) {
      return NextResponse.json(
        { error: 'curso_id es requerido' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('curso_pasos')
      .select('*')
      .eq('curso_id', curso_id)
      .order('orden')

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching curso pasos:', error)
    return NextResponse.json(
      { error: 'Error al obtener pasos del curso' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar todos los pasos de un curso (requiere autenticación admin)
export async function DELETE(request: NextRequest) {
  try {
    // Validar autenticación de admin
    const adminSession = requireAdminAuth(request)
    
    const { searchParams } = new URL(request.url)
    const curso_id = searchParams.get('curso_id')

    if (!curso_id) {
      return NextResponse.json(
        { error: 'curso_id es requerido' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('curso_pasos')
      .delete()
      .eq('curso_id', curso_id)

    if (error) throw error

    return NextResponse.json({ 
      message: 'Pasos del curso eliminados exitosamente'
    })
  } catch (error: any) {
    console.error('Error deleting curso pasos:', error)
    
    if (error.message === 'Unauthorized: Admin authentication required') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error al eliminar pasos del curso' },
      { status: 500 }
    )
  }
}