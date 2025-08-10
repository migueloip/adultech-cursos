import { supabase } from './supabase'

// Tipos para los archivos
export type FileUploadResult = {
  success: boolean
  url?: string
  error?: string
}

// Función para subir imágenes a Supabase Storage
export async function uploadImage(file: File, folder: string = 'images'): Promise<FileUploadResult> {
  try {
    // Validar que sea una imagen
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'El archivo debe ser una imagen'
      }
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'La imagen no puede ser mayor a 5MB'
      }
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('media') // nombre del bucket
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading image:', error)
      return {
        success: false,
        error: 'Error al subir la imagen: ' + error.message
      }
    }

    // Obtener URL pública del archivo
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl
    }
  } catch (error) {
    console.error('Error in uploadImage:', error)
    return {
      success: false,
      error: 'Error inesperado al subir la imagen'
    }
  }
}

// Función para subir videos a Supabase Storage
export async function uploadVideo(file: File, folder: string = 'videos'): Promise<FileUploadResult> {
  try {
    // Validar que sea un video
    if (!file.type.startsWith('video/')) {
      return {
        success: false,
        error: 'El archivo debe ser un video'
      }
    }

    // Validar tamaño (máximo 100MB)
    if (file.size > 100 * 1024 * 1024) {
      return {
        success: false,
        error: 'El video no puede ser mayor a 100MB'
      }
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('media') // nombre del bucket
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading video:', error)
      return {
        success: false,
        error: 'Error al subir el video: ' + error.message
      }
    }

    // Obtener URL pública del archivo
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl
    }
  } catch (error) {
    console.error('Error in uploadVideo:', error)
    return {
      success: false,
      error: 'Error inesperado al subir el video'
    }
  }
}

// Función para eliminar archivos de Supabase Storage
export async function deleteFile(url: string): Promise<boolean> {
  try {
    // Extraer el path del archivo de la URL
    const urlParts = url.split('/storage/v1/object/public/media/')
    if (urlParts.length !== 2) {
      console.error('URL format not recognized:', url)
      return false
    }

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('media')
      .remove([filePath])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteFile:', error)
    return false
  }
}

// Función para validar URLs de archivos
export function isValidFileUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Función para obtener el tipo de archivo desde una URL
export function getFileTypeFromUrl(url: string): 'image' | 'video' | 'unknown' {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov']
  
  const lowerUrl = url.toLowerCase()
  
  if (imageExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'image'
  }
  
  if (videoExtensions.some(ext => lowerUrl.includes(ext))) {
    return 'video'
  }
  
  return 'unknown'
}