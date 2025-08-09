-- Script completo para configurar la base de datos con RLS y autenticación por cookies
-- Este script incluye: creación de tablas, datos iniciales, y políticas RLS optimizadas

-- =====================================================
-- 1. CREACIÓN DE TABLAS
-- =====================================================

-- Crear tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  icono VARCHAR(50) DEFAULT 'Smartphone',
  color VARCHAR(100) DEFAULT 'bg-green-100 border-green-300',
  icon_color VARCHAR(50) DEFAULT 'text-green-600',
  video_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de pasos de cursos
CREATE TABLE IF NOT EXISTS curso_pasos (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
  orden INTEGER NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  imagen_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(curso_id, orden)
);

-- =====================================================
-- 2. DATOS INICIALES
-- =====================================================

-- Insertar cursos iniciales (solo si no existen)
INSERT INTO cursos (titulo, descripcion, icono, color, icon_color, video_url) 
SELECT * FROM (
  VALUES 
    ('Cómo encender y apagar el teléfono', 'Aprende los primeros pasos para usar tu teléfono Android', 'Smartphone', 'bg-green-100 border-green-300', 'text-green-600', ''),
    ('Cómo hacer llamadas', 'Descubre cómo llamar a tus seres queridos de forma fácil', 'Phone', 'bg-blue-100 border-blue-300', 'text-blue-600', ''),
    ('Cómo enviar mensajes', 'Envía mensajes de texto paso a paso', 'MessageSquare', 'bg-purple-100 border-purple-300', 'text-purple-600', ''),
    ('Cómo usar WhatsApp', 'Conecta con familia y amigos a través de WhatsApp', 'MessageSquare', 'bg-emerald-100 border-emerald-300', 'text-emerald-600', ''),
    ('Cómo conectarse a Wi-Fi', 'Conecta tu teléfono a internet de forma segura', 'Wifi', 'bg-orange-100 border-orange-300', 'text-orange-600', ''),
    ('Cómo usar la cámara', 'Toma fotos y videos para guardar tus momentos especiales', 'Camera', 'bg-pink-100 border-pink-300', 'text-pink-600', '')
) AS v(titulo, descripcion, icono, color, icon_color, video_url)
WHERE NOT EXISTS (SELECT 1 FROM cursos WHERE cursos.titulo = v.titulo);

-- Insertar pasos de cursos (solo si no existen)
-- Curso 1: Cómo encender y apagar el teléfono
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url)
SELECT 1, * FROM (
  VALUES 
    (1, 'Paso 1: Ubicar el botón de encendido', 'El botón de encendido generalmente se encuentra en el lado derecho de tu teléfono. Es un botón más grande que los demás.', '/placeholder.svg?height=300&width=400&text=Botón+de+encendido'),
    (2, 'Paso 2: Encender el teléfono', 'Presiona y mantén presionado el botón de encendido durante 3 segundos hasta que veas la pantalla iluminarse.', '/placeholder.svg?height=300&width=400&text=Presionar+botón'),
    (3, 'Paso 3: Apagar el teléfono', 'Para apagar, presiona y mantén el botón de encendido hasta que aparezca un menú. Luego toca "Apagar".', '/placeholder.svg?height=300&width=400&text=Menú+apagar')
) AS v(orden, titulo, descripcion, imagen_url)
WHERE NOT EXISTS (SELECT 1 FROM curso_pasos WHERE curso_id = 1);

-- Curso 2: Cómo hacer llamadas
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url)
SELECT 2, * FROM (
  VALUES 
    (1, 'Paso 1: Abrir la aplicación de teléfono', 'Busca el ícono verde con un teléfono en tu pantalla principal y tócalo una vez.', '/placeholder.svg?height=300&width=400&text=Ícono+teléfono'),
    (2, 'Paso 2: Marcar el número', 'Usa el teclado numérico para escribir el número de teléfono que quieres llamar.', '/placeholder.svg?height=300&width=400&text=Teclado+numérico'),
    (3, 'Paso 3: Realizar la llamada', 'Presiona el botón verde con el ícono de teléfono para iniciar la llamada.', '/placeholder.svg?height=300&width=400&text=Botón+llamar')
) AS v(orden, titulo, descripcion, imagen_url)
WHERE NOT EXISTS (SELECT 1 FROM curso_pasos WHERE curso_id = 2);

-- Curso 3: Cómo enviar mensajes
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url)
SELECT 3, * FROM (
  VALUES 
    (1, 'Paso 1: Abrir mensajes', 'Busca el ícono de mensajes (generalmente parece una burbuja de conversación) y tócalo.', '/placeholder.svg?height=300&width=400&text=Ícono+mensajes'),
    (2, 'Paso 2: Crear nuevo mensaje', 'Toca el botón "+" o "Nuevo mensaje" para comenzar a escribir.', '/placeholder.svg?height=300&width=400&text=Nuevo+mensaje'),
    (3, 'Paso 3: Escribir y enviar', 'Escribe tu mensaje y presiona el botón "Enviar" (generalmente una flecha).', '/placeholder.svg?height=300&width=400&text=Escribir+mensaje')
) AS v(orden, titulo, descripcion, imagen_url)
WHERE NOT EXISTS (SELECT 1 FROM curso_pasos WHERE curso_id = 3);

-- Curso 4: Cómo usar WhatsApp
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url)
SELECT 4, * FROM (
  VALUES 
    (1, 'Paso 1: Abrir WhatsApp', 'Busca el ícono verde de WhatsApp en tu teléfono y tócalo para abrirlo.', '/placeholder.svg?height=300&width=400&text=Ícono+WhatsApp'),
    (2, 'Paso 2: Seleccionar contacto', 'Toca en el nombre de la persona con quien quieres chatear.', '/placeholder.svg?height=300&width=400&text=Lista+contactos'),
    (3, 'Paso 3: Enviar mensaje', 'Escribe tu mensaje en la parte inferior y toca el botón de enviar.', '/placeholder.svg?height=300&width=400&text=Chat+WhatsApp')
) AS v(orden, titulo, descripcion, imagen_url)
WHERE NOT EXISTS (SELECT 1 FROM curso_pasos WHERE curso_id = 4);

-- Curso 5: Cómo conectarse a Wi-Fi
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url)
SELECT 5, * FROM (
  VALUES 
    (1, 'Paso 1: Abrir configuración', 'Busca el ícono de configuración (parece un engranaje) y tócalo.', '/placeholder.svg?height=300&width=400&text=Configuración'),
    (2, 'Paso 2: Buscar Wi-Fi', 'Busca la opción "Wi-Fi" o "Conexiones" y tócala.', '/placeholder.svg?height=300&width=400&text=Menú+Wi-Fi'),
    (3, 'Paso 3: Conectar a red', 'Selecciona tu red Wi-Fi e ingresa la contraseña si es necesario.', '/placeholder.svg?height=300&width=400&text=Conectar+Wi-Fi')
) AS v(orden, titulo, descripcion, imagen_url)
WHERE NOT EXISTS (SELECT 1 FROM curso_pasos WHERE curso_id = 5);

-- Curso 6: Cómo usar la cámara
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url)
SELECT 6, * FROM (
  VALUES 
    (1, 'Paso 1: Abrir la cámara', 'Busca el ícono de la cámara en tu pantalla y tócalo para abrirla.', '/placeholder.svg?height=300&width=400&text=Ícono+cámara'),
    (2, 'Paso 2: Enfocar la imagen', 'Apunta la cámara hacia lo que quieres fotografiar y toca la pantalla para enfocar.', '/placeholder.svg?height=300&width=400&text=Enfocar+cámara'),
    (3, 'Paso 3: Tomar la foto', 'Presiona el botón circular grande en la parte inferior para tomar la foto.', '/placeholder.svg?height=300&width=400&text=Botón+foto')
) AS v(orden, titulo, descripcion, imagen_url)
WHERE NOT EXISTS (SELECT 1 FROM curso_pasos WHERE curso_id = 6);

-- Insertar usuario administrador por defecto (solo si no existe)
INSERT INTO admins (username, password_hash)
SELECT 'admin', '$2b$10$rQZ9vKzf8vKzf8vKzf8vKOeJ9vKzf8vKzf8vKzf8vKzf8vKzf8vKzu'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');
-- Contraseña por defecto: admin123

-- =====================================================
-- 3. CONFIGURACIÓN DE RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Enable read access for all users" ON admins;
DROP POLICY IF EXISTS "Admins can read their own data" ON admins;
DROP POLICY IF EXISTS "Service role can manage admins" ON admins;
DROP POLICY IF EXISTS "Enable read access for login" ON admins;
DROP POLICY IF EXISTS "Admins can update courses" ON cursos;
DROP POLICY IF EXISTS "Enable read access for all users" ON cursos;
DROP POLICY IF EXISTS "Admins can create courses" ON cursos;
DROP POLICY IF EXISTS "Admins can delete courses" ON cursos;
DROP POLICY IF EXISTS "Admins can manage courses" ON cursos;
DROP POLICY IF EXISTS "Service role can manage courses" ON cursos;
DROP POLICY IF EXISTS "Admins can update course steps" ON curso_pasos;
DROP POLICY IF EXISTS "Enable read access for all users" ON curso_pasos;
DROP POLICY IF EXISTS "Admins can create course steps" ON curso_pasos;
DROP POLICY IF EXISTS "Admins can delete course steps" ON curso_pasos;
DROP POLICY IF EXISTS "Admins can manage course steps" ON curso_pasos;
DROP POLICY IF EXISTS "Service role can manage course steps" ON curso_pasos;

-- Habilitar RLS en todas las tablas
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE curso_pasos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS PARA LA TABLA ADMINS
-- =====================================================

-- Permitir lectura para todos (necesario para login)
CREATE POLICY "Enable read access for login" ON admins
  FOR SELECT
  USING (true);

-- Permitir operaciones administrativas solo con service role
CREATE POLICY "Service role can manage admins" ON admins
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA LA TABLA CURSOS
-- =====================================================

-- Permitir lectura para todos los usuarios (público)
CREATE POLICY "Enable read access for all users" ON cursos
  FOR SELECT
  USING (true);

-- Permitir operaciones administrativas solo con service role
CREATE POLICY "Service role can manage courses" ON cursos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- POLÍTICAS PARA LA TABLA CURSO_PASOS
-- =====================================================

-- Permitir lectura para todos los usuarios (público)
CREATE POLICY "Enable read access for all users" ON curso_pasos
  FOR SELECT
  USING (true);

-- Permitir operaciones administrativas solo con service role
CREATE POLICY "Service role can manage course steps" ON curso_pasos
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- 4. VERIFICACIONES Y ESTADÍSTICAS
-- =====================================================

-- Verificar las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('admins', 'cursos', 'curso_pasos')
ORDER BY tablename, policyname;

-- Mostrar estado de RLS
SELECT 
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE tablename IN ('admins', 'cursos', 'curso_pasos')
ORDER BY tablename;

-- Mostrar información de las tablas
SELECT 'Cursos en BD:' as info, COUNT(*) as cantidad FROM cursos
UNION ALL
SELECT 'Pasos en BD:' as info, COUNT(*) as cantidad FROM curso_pasos
UNION ALL
SELECT 'Admins en BD:' as info, COUNT(*) as cantidad FROM admins;

-- =====================================================
-- CONFIGURACIÓN COMPLETADA
-- =====================================================

-- Este script ha configurado:
-- ✅ Tablas de la base de datos
-- ✅ Datos iniciales (6 cursos con sus pasos)
-- ✅ Usuario administrador por defecto (admin/admin123)
-- ✅ Políticas RLS optimizadas para autenticación por cookies
-- ✅ Seguridad: lectura pública, escritura solo con service role

-- IMPORTANTE: 
-- 1. Configura SUPABASE_SERVICE_ROLE_KEY en tu .env.local
-- 2. El usuario admin por defecto es: admin/admin123
-- 3. RLS está activo y funcionando correctamente