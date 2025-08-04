-- Script para insertar un curso editable en la base de datos
-- Reemplaza los valores entre [CORCHETES] con la información real del curso

-- 1. Insertar el curso principal
INSERT INTO cursos (titulo, descripcion, icono, color, icon_color, video_url) VALUES
('[TITULO_DEL_CURSO]', '[DESCRIPCION_DEL_CURSO]', '[ICONO]', '[COLOR_FONDO]', '[COLOR_ICONO]', '[URL_VIDEO]');

-- 2. Obtener el ID del curso recién insertado (usar el último ID)
-- SELECT currval('cursos_id_seq') AS curso_id;

-- 3. Insertar los pasos del curso
-- Reemplaza [CURSO_ID] con el ID obtenido del paso anterior
-- Agrega tantos pasos como necesites

INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url) VALUES
([CURSO_ID], 1, '[TITULO_PASO_1]', '[DESCRIPCION_PASO_1]', '[URL_IMAGEN_1]'),
([CURSO_ID], 2, '[TITULO_PASO_2]', '[DESCRIPCION_PASO_2]', '[URL_IMAGEN_2]'),
([CURSO_ID], 3, '[TITULO_PASO_3]', '[DESCRIPCION_PASO_3]', '[URL_IMAGEN_3]');
-- Agrega más pasos si es necesario...

-- EJEMPLO COMPLETO DE USO:
-- Reemplaza los valores de ejemplo con los datos reales

/*
-- Ejemplo: Curso sobre "Cómo usar el navegador"
INSERT INTO cursos (titulo, descripcion, icono, color, icon_color, video_url) VALUES
('Cómo usar el navegador web', 'Aprende a navegar por internet de forma segura y fácil', 'Globe', 'bg-indigo-100 border-indigo-300', 'text-indigo-600', 'https://example.com/video-navegador');

-- Obtener el ID del curso (ejecutar esta consulta para ver el ID)
SELECT currval('cursos_id_seq') AS curso_id;

-- Insertar pasos (reemplazar 7 con el ID real obtenido)
INSERT INTO curso_pasos (curso_id, orden, titulo, descripcion, imagen_url) VALUES
(7, 1, 'Paso 1: Abrir el navegador', 'Busca el ícono del navegador en tu pantalla principal y tócalo para abrirlo.', '/placeholder.svg?height=300&width=400&text=Abrir+navegador'),
(7, 2, 'Paso 2: Escribir una dirección web', 'En la barra superior, toca donde dice "Buscar o escribir dirección web" y escribe la página que quieres visitar.', '/placeholder.svg?height=300&width=400&text=Escribir+URL'),
(7, 3, 'Paso 3: Navegar por la página', 'Usa tu dedo para desplazarte hacia arriba y abajo en la página. Toca los enlaces azules para ir a otras páginas.', '/placeholder.svg?height=300&width=400&text=Navegar+página');
*/

-- GUÍA DE VALORES:
-- [TITULO_DEL_CURSO]: Nombre descriptivo del curso (ej: "Cómo usar WhatsApp")
-- [DESCRIPCION_DEL_CURSO]: Descripción breve de lo que aprenderá el usuario
-- [ICONO]: Nombre del ícono de Lucide React (ej: 'Smartphone', 'Phone', 'MessageSquare', 'Camera', 'Wifi', 'Globe')
-- [COLOR_FONDO]: Clase de Tailwind para el fondo (ej: 'bg-green-100 border-green-300')
-- [COLOR_ICONO]: Clase de Tailwind para el color del ícono (ej: 'text-green-600')
-- [URL_VIDEO]: URL del video tutorial (opcional, puede ser null)
-- [CURSO_ID]: ID numérico del curso obtenido después de la inserción
-- [TITULO_PASO_X]: Título descriptivo del paso
-- [DESCRIPCION_PASO_X]: Explicación detallada del paso
-- [URL_IMAGEN_X]: URL de la imagen ilustrativa del paso

-- COLORES DISPONIBLES:
-- Verde: 'bg-green-100 border-green-300', 'text-green-600'
-- Azul: 'bg-blue-100 border-blue-300', 'text-blue-600'
-- Púrpura: 'bg-purple-100 border-purple-300', 'text-purple-600'
-- Esmeralda: 'bg-emerald-100 border-emerald-300', 'text-emerald-600'
-- Naranja: 'bg-orange-100 border-orange-300', 'text-orange-600'
-- Rosa: 'bg-pink-100 border-pink-300', 'text-pink-600'
-- Índigo: 'bg-indigo-100 border-indigo-300', 'text-indigo-600'
-- Rojo: 'bg-red-100 border-red-300', 'text-red-600'
-- Amarillo: 'bg-yellow-100 border-yellow-300', 'text-yellow-600'
-- Gris: 'bg-gray-100 border-gray-300', 'text-gray-600'

-- ICONOS COMUNES:
-- Smartphone, Phone, MessageSquare, Camera, Wifi, Globe, Mail, Settings, 
-- Users, Heart, Home, Search, Download, Upload, Play, Pause, Volume2, etc.