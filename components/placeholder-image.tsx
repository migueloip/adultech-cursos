"use client"

import React from 'react'
import { getPlaceholderUrl } from '@/lib/image-utils'

interface PlaceholderImageProps {
  width?: number
  height?: number
  text?: string
  className?: string
  alt?: string
}

export function PlaceholderImage({ 
  width = 400, 
  height = 300, 
  text = "Imagen", 
  className = "",
  alt = "Placeholder image"
}: PlaceholderImageProps) {
  const dataUrl = getPlaceholderUrl(width, height, text)
  
  return (
    <img
      src={dataUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}

// Re-export para compatibilidad
export { getPlaceholderUrl, processImageUrl } from '@/lib/image-utils'