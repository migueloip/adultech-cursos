-- Script para configurar políticas de RLS para Supabase Storage
-- Ejecutar este script en el SQL Editor de Supabase Dashboard

-- Habilitar RLS en la tabla storage.objects si no está habilitado
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Public read access for media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access for media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for media bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for media bucket" ON storage.objects;

-- Crear políticas para permitir acceso público al bucket 'media'

-- Permitir lectura pública de archivos en el bucket media
CREATE POLICY "Public read access for media bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'media');

-- Permitir uploads públicos al bucket media
CREATE POLICY "Public upload access for media bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media');

-- Permitir actualización pública de archivos en el bucket media
CREATE POLICY "Public update access for media bucket" ON storage.objects
FOR UPDATE USING (bucket_id = 'media');

-- Permitir eliminación pública de archivos en el bucket media
CREATE POLICY "Public delete access for media bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'media');

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';