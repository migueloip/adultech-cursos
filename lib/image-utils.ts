// Función helper para generar URLs de placeholder
export function getPlaceholderUrl(width: number = 400, height: number = 300, text: string = "Imagen"): string {
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f1f5f9"/>
      <rect x="2" y="2" width="${width-4}" height="${height-4}" fill="none" stroke="#cbd5e1" stroke-width="2"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#64748b" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `
  
  return `data:image/svg+xml;base64,${btoa(svgContent)}`
}

// Función para procesar URLs de imagen y convertir placeholders problemáticos
export function processImageUrl(url: string | undefined, fallbackText: string = "Imagen"): string {
  if (!url) {
    return getPlaceholderUrl(400, 300, fallbackText)
  }
  
  // Si es una URL de placeholder con parámetros, extraer el texto y generar nueva URL
  if (url.includes('placeholder.svg?')) {
    const urlParams = new URLSearchParams(url.split('?')[1])
    const text = urlParams.get('text') || fallbackText
    const width = parseInt(urlParams.get('width') || '400')
    const height = parseInt(urlParams.get('height') || '300')
    
    return getPlaceholderUrl(width, height, decodeURIComponent(text))
  }
  
  // Si es una URL de Imgur, convertir a URL directa de imagen y usar el proxy
  if (url.includes('imgur.com')) {
    let imgurUrl = url
    
    // Convertir URLs de página de Imgur a URLs directas de imagen
    if (url.includes('imgur.com/') && !url.includes('i.imgur.com')) {
      const imgurId = url.split('imgur.com/')[1].split('?')[0].split('#')[0]
      // Intentar con .jpg primero, el proxy manejará otros formatos si es necesario
      imgurUrl = `https://i.imgur.com/${imgurId}.jpg`
    }
    
    return `/api/proxy-image?url=${encodeURIComponent(imgurUrl)}`
  }
  
  return url
}