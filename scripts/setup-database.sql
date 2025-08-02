-- Eliminar tablas existentes si existen (para empezar limpio)
DROP TABLE IF EXISTS curso_pasos CASCADE;
DROP TABLE IF EXISTS cursos CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- Crear tabla de cursos
CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  icono VARCHAR(50) NOT NULL DEFAULT 'Smartphone',
  color VARCHAR(100) NOT NULL DEFAULT 'bg-green-100 border-green-300',
  icon_color VARCHAR(50) NOT NULL DEFAULT 'text-green-600',
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de pasos de cursos
CREATE TABLE curso_pasos (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id) ON DELETE CASCADE,
  orden INTEGER NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de administradores
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos iniciales de cursos
INSERT INTO cursos (titulo, descripcion, icono, color, icon_color, video_url) VALUES
('Cómo encender y apagar el teléfono', 'Aprende los primeros pasos para usar tu teléfono Android', 'Smartphone', 'bg-green-100 border-green-300', 'text-green-600', 'https://example.com/video1'),
('Cómo hacer llamadas', 'Descubre cómo llamar a tus seres queridos de forma fácil', 'Phone', 'bg-blue-100 border-blue-300', 'text-blue-600', 'https://example.com/video2'),
('Cómo enviar mensajes', 'Envía mensajes de texto paso a paso', 'MessageSquare', 'bg-purple-100 border-purple-300', 'text-purple-600', 'https://example.com/video3'),
('Cómo usar WhatsApp', 'Conecta con familia y amigos a través de WhatsApp', 'MessageSquare', 'bg-emerald-100 border-emerald-300', 'text-emerald-600', 'https://example.com/video4'),
('Cómo conectarse a Wi-Fi', 'Conecta tu teléfono a internet de forma segura', 'Wifi', 'bg-orange-100 border-orange-300', 'text-orange-600', 'https://example.com/video5'),
('Cómo usar la cámara', 'Toma fotos y videos para guardar tus momentos especiales', 'Camera', 'bg-pink-100 border-pink-300', 'text-pink-600', 'https://example.com/video6');

-- Insertar pasos para el primer curso
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url) VALUES
(1, 1, 'Paso 1: Ubicar el botón de encendido', 'El botón de encendido generalmente se encuentra en el lado derecho de tu teléfono. Es un botón más grande que los demás.', '/placeholder.svg?height=300&width=400&text=Botón+de+encendido'),
(1, 2, 'Paso 2: Encender el teléfono', 'Presiona y mantén presionado el botón de encendido durante 3 segundos hasta que veas la pantalla iluminarse.', '/placeholder.svg?height=300&width=400&text=Presionar+botón'),
(1, 3, 'Paso 3: Apagar el teléfono', 'Para apagar, presiona y mantén el botón de encendido hasta que aparezca un menú. Luego toca "Apagar".', '/placeholder.svg?height=300&width=400&text=Menú+apagar');

-- Insertar pasos para el segundo curso
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url) VALUES
(2, 1, 'Paso 1: Abrir la aplicación de teléfono', 'Busca el ícono verde con un teléfono en tu pantalla principal y tócalo una vez.', '/placeholder.svg?height=300&width=400&text=Ícono+teléfono'),
(2, 2, 'Paso 2: Marcar el número', 'Usa el teclado numérico para escribir el número de teléfono que quieres llamar.', '/placeholder.svg?height=300&width=400&text=Teclado+numérico'),
(2, 3, 'Paso 3: Realizar la llamada', 'Presiona el botón verde con el ícono de teléfono para iniciar la llamada.', '/placeholder.svg?height=300&width=400&text=Botón+llamar');

-- Insertar pasos para el tercer curso
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url) VALUES
(3, 1, 'Paso 1: Abrir mensajes', 'Busca el ícono de mensajes (generalmente parece una burbuja de conversación) y tócalo.', '/placeholder.svg?height=300&width=400&text=Ícono+mensajes'),
(3, 2, 'Paso 2: Crear nuevo mensaje', 'Toca el botón "+" o "Nuevo mensaje" para comenzar a escribir.', '/placeholder.svg?height=300&width=400&text=Nuevo+mensaje'),
(3, 3, 'Paso 3: Escribir y enviar', 'Escribe tu mensaje y presiona el botón "Enviar" (generalmente una flecha).', '/placeholder.svg?height=300&width=400&text=Escribir+mensaje');

-- Insertar pasos para el cuarto curso
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url) VALUES
(4, 1, 'Paso 1: Abrir WhatsApp', 'Busca el ícono verde de WhatsApp en tu teléfono y tócalo para abrirlo.', '/placeholder.svg?height=300&width=400&text=Ícono+WhatsApp'),
(4, 2, 'Paso 2: Seleccionar contacto', 'Toca en el nombre de la persona con quien quieres chatear.', '/placeholder.svg?height=300&width=400&text=Lista+contactos'),
(4, 3, 'Paso 3: Enviar mensaje', 'Escribe tu mensaje en la parte inferior y toca el botón de enviar.', '/placeholder.svg?height=300&width=400&text=Chat+WhatsApp');

-- Insertar pasos para el quinto curso
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url) VALUES
(5, 1, 'Paso 1: Abrir configuración', 'Busca el ícono de configuración (parece un engranaje) y tócalo.', '/placeholder.svg?height=300&width=400&text=Configuración'),
(5, 2, 'Paso 2: Buscar Wi-Fi', 'Busca la opción "Wi-Fi" o "Conexiones" y tócala.', '/placeholder.svg?height=300&width=400&text=Menú+Wi-Fi'),
(5, 3, 'Paso 3: Conectar a red', 'Selecciona tu red Wi-Fi e ingresa la contraseña si es necesario.', '/placeholder.svg?height=300&width=400&text=Conectar+Wi-Fi');

-- Insertar pasos para el sexto curso
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url) VALUES
(6, 1, 'Paso 1: Abrir la cámara', 'Busca el ícono de la cámara en tu pantalla y tócalo para abrirla.', '/placeholder.svg?height=300&width=400&text=Ícono+cámara'),
(6, 2, 'Paso 2: Enfocar la imagen', 'Apunta la cámara hacia lo que quieres fotografiar y toca la pantalla para enfocar.', '/placeholder.svg?height=300&width=400&text=Enfocar+cámara'),
(6, 3, 'Paso 3: Tomar la foto', 'Presiona el botón circular grande en la parte inferior para tomar la foto.', '/placeholder.svg?height=300&width=400&text=Botón+foto');

-- Insertar admin por defecto (contraseña: admin123)
INSERT INTO admins (username, password_hash) VALUES
('admin', '$2b$10$rOvHPGkwMtKWzKzYvKzKzOvHPGkwMtKWzKzYvKzKzOvHPGkwMtKWz');

-- Verificar que todo se creó correctamente
SELECT 'Cursos creados:' as info, COUNT(*) as cantidad FROM cursos
UNION ALL
SELECT 'Pasos creados:' as info, COUNT(*) as cantidad FROM curso_pasos
UNION ALL
SELECT 'Admins creados:' as info, COUNT(*) as cantidad FROM admins;
