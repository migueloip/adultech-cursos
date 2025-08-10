"use client"

import React, { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Upload, X, Image as ImageIcon, Video, AlertCircle, Check } from 'lucide-react'
import { uploadImage, uploadVideo, type FileUploadResult } from '@/lib/upload-utils'
import Image from 'next/image'

type FileUploadProps = {
  type: 'image' | 'video'
  onUploadComplete: (url: string) => void
  onUploadError?: (error: string) => void
  currentUrl?: string
  label?: string
  className?: string
}

export function FileUpload({
  type,
  onUploadComplete,
  onUploadError,
  currentUrl,
  label,
  className = ''
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const acceptedTypes = type === 'image' 
    ? 'image/jpeg,image/png,image/gif,image/webp'
    : 'video/mp4,video/webm,video/ogg'

  const maxSize = type === 'image' ? '5MB' : '100MB'
  const maxSizeBytes = type === 'image' ? 5 * 1024 * 1024 : 100 * 1024 * 1024

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return

    // Validar tipo de archivo
    const isValidType = type === 'image' 
      ? file.type.startsWith('image/')
      : file.type.startsWith('video/')

    if (!isValidType) {
      const error = `Por favor selecciona un archivo de ${type === 'image' ? 'imagen' : 'video'} válido`
      setUploadStatus('error')
      onUploadError?.(error)
      return
    }

    // Validar tamaño
    if (file.size > maxSizeBytes) {
      const error = `El archivo no puede ser mayor a ${maxSize}`
      setUploadStatus('error')
      onUploadError?.(error)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus('idle')

    // Crear preview local
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    // Simular progreso de upload
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      let result: FileUploadResult
      
      if (type === 'image') {
        result = await uploadImage(file, 'course-images')
      } else {
        result = await uploadVideo(file, 'course-videos')
      }

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success && result.url) {
        setUploadStatus('success')
        setPreviewUrl(result.url)
        onUploadComplete(result.url)
      } else {
        setUploadStatus('error')
        onUploadError?.(result.error || 'Error al subir el archivo')
        setPreviewUrl(null)
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadStatus('error')
      onUploadError?.('Error inesperado al subir el archivo')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
      // Limpiar preview local
      if (localPreview.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview)
      }
    }
  }, [type, maxSizeBytes, maxSize, onUploadComplete, onUploadError])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleRemoveFile = useCallback(() => {
    setPreviewUrl(null)
    setUploadStatus('idle')
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      {label && (
        <Label className="text-white text-sm font-medium">
          {label}
        </Label>
      )}
      
      <Card className={`
        border-2 border-dashed transition-all duration-200
        ${isDragging 
          ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
          : 'border-slate-600 dark:border-slate-500 bg-slate-700 dark:bg-slate-800'
        }
        ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer hover:border-slate-500'}
      `}>
        <CardContent 
          className="p-6 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {previewUrl ? (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative max-w-xs mx-auto">
                {type === 'image' ? (
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={150}
                    className="rounded-lg object-cover w-full h-32"
                  />
                ) : (
                  <video
                    src={previewUrl}
                    className="rounded-lg object-cover w-full h-32"
                    controls
                  />
                )}
                
                {!isUploading && (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {/* Status */}
              <div className="flex items-center justify-center space-x-2">
                {uploadStatus === 'success' && (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500">Subido correctamente</span>
                  </>
                )}
                {uploadStatus === 'error' && (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-500">Error al subir</span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-slate-400">
                {type === 'image' ? (
                  <ImageIcon className="w-full h-full" />
                ) : (
                  <Video className="w-full h-full" />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-white font-medium">
                  Arrastra y suelta tu {type === 'image' ? 'imagen' : 'video'} aquí
                </p>
                <p className="text-slate-400 text-sm">
                  o haz clic para seleccionar un archivo
                </p>
                <p className="text-slate-500 text-xs">
                  Máximo {maxSize} • {type === 'image' ? 'JPG, PNG, GIF, WebP' : 'MP4, WebM, OGG'}
                </p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="bg-transparent border-slate-600 text-white hover:bg-slate-700"
                onClick={(e) => {
                  e.stopPropagation()
                  handleButtonClick()
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Seleccionar archivo
              </Button>
            </div>
          )}
          
          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-slate-400">
                Subiendo... {uploadProgress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}