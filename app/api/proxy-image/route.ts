import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')

  if (!imageUrl) {
    return new NextResponse('URL de imagen requerida', { status: 400 })
  }

  try {
    // Validar que la URL sea de un dominio permitido
    const url = new URL(imageUrl)
    const allowedDomains = ['imgur.com', 'i.imgur.com']
    
    if (!allowedDomains.includes(url.hostname)) {
      return new NextResponse('Dominio no permitido', { status: 403 })
    }

    // Obtener la imagen del servidor externo
    let response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://imgur.com/',
      },
    })

    // Si la imagen no se encuentra y es de Imgur, intentar con otros formatos
    if (!response.ok && url.hostname.includes('imgur.com') && imageUrl.endsWith('.jpg')) {
      const baseUrl = imageUrl.replace('.jpg', '')
      const formats = ['.png', '.gif', '.jpeg', '.webp']
      
      for (const format of formats) {
        const altUrl = baseUrl + format
        const altResponse = await fetch(altUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://imgur.com/',
          },
        })
        
        if (altResponse.ok) {
          response = altResponse
          break
        }
      }
    }

    if (!response.ok) {
      return new NextResponse('Error al obtener la imagen', { status: response.status })
    }

    // Obtener el tipo de contenido
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    // Obtener los datos de la imagen
    const imageData = await response.arrayBuffer()

    // Devolver la imagen con los headers apropiados
    return new NextResponse(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache por 24 horas
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error en proxy de imagen:', error)
    return new NextResponse('Error interno del servidor', { status: 500 })
  }
}