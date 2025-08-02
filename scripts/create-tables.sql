-- Crear tabla de cursos
CREATE TABLE IF NOT EXISTS cursos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  icono VARCHAR(50) NOT NULL,
  color VARCHAR(50) NOT NULL,
  icon_color VARCHAR(50) NOT NULL,
  video_url TEXT,
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
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
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

-- Insertar admin por defecto (contraseña: admin123)
INSERT INTO admins (username, password_hash) VALUES
('admin', '$2b$10$rOvHPGkwMtKWzKzYvKzKzOvHPGkwMtKWzKzYvKzKzOvHPGkwMtKWz');
