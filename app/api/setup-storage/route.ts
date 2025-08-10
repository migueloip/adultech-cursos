import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Esta función configura el bucket de storage en Supabase
export async function POST(request: NextRequest) {
  try {
    // Verificar que tenemos acceso administrativo
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      )
    }

    // Crear el bucket 'media' si no existe
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      return NextResponse.json(
        { error: 'Error checking existing buckets' },
        { status: 500 }
      )
    }

    const mediaBucket = buckets?.find((bucket: any) => bucket.name === 'media')
    
    if (!mediaBucket) {
      // Crear el bucket
      const { data: newBucket, error: createError } = await supabaseAdmin.storage.createBucket('media', {
        public: true,
        allowedMimeTypes: [
          // Imágenes
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'image/svg+xml',
          // Videos
          'video/mp4',
          'video/webm',
          'video/ogg',
          'video/avi',
          'video/mov'
        ],
        fileSizeLimit: 104857600 // 100MB
      })

      if (createError) {
        console.error('Error creating bucket:', createError)
        return NextResponse.json(
          { error: 'Error creating storage bucket: ' + createError.message },
          { status: 500 }
        )
      }

      console.log('Media bucket created successfully:', newBucket)
    }

    // Configurar políticas de acceso público para lectura
    const policies = [
      {
        name: 'Public read access',
        definition: {
          role: 'public',
          action: 'SELECT',
          resource: 'storage.objects',
          check: 'bucket_id = \'media\''
        }
      },
      {
        name: 'Authenticated upload access',
        definition: {
          role: 'authenticated',
          action: 'INSERT',
          resource: 'storage.objects',
          check: 'bucket_id = \'media\''
        }
      },
      {
        name: 'Authenticated update access',
        definition: {
          role: 'authenticated',
          action: 'UPDATE',
          resource: 'storage.objects',
          check: 'bucket_id = \'media\''
        }
      },
      {
        name: 'Authenticated delete access',
        definition: {
          role: 'authenticated',
          action: 'DELETE',
          resource: 'storage.objects',
          check: 'bucket_id = \'media\''
        }
      }
    ]

    // Nota: Las políticas de RLS se deben configurar manualmente en el dashboard de Supabase
    // o mediante SQL directo. Esta API route solo crea el bucket.

    return NextResponse.json({
      success: true,
      message: 'Storage bucket configured successfully',
      bucket: mediaBucket ? 'exists' : 'created'
    })

  } catch (error) {
    console.error('Error in setup-storage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Endpoint para verificar el estado del storage
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase admin client not configured' },
        { status: 500 }
      )
    }

    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets()
    
    if (error) {
      return NextResponse.json(
        { error: 'Error checking storage status' },
        { status: 500 }
      )
    }

    const mediaBucket = buckets?.find((bucket: any) => bucket.name === 'media')
    
    return NextResponse.json({
      configured: !!mediaBucket,
      buckets: buckets?.map((b: any) => ({ name: b.name, public: b.public })) || []
    })

  } catch (error) {
    console.error('Error checking storage status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}