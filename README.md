# AdulTech Cursos

**Plataforma educativa diseñada para enseñar tecnología básica a adultos mayores**

*Creado por: Miguel Figueroa LBIC 4°G 2025 Especialidad de programacion*

## 📱 Descripción

AdulTech Cursos es una aplicación web educativa especialmente diseñada para ayudar a adultos mayores a aprender a usar tecnología básica, particularmente teléfonos Android. La plataforma ofrece cursos paso a paso con un enfoque en accesibilidad y facilidad de uso.

## ✨ Características Principales

### ♿ Características de Accesibilidad
- **Control de tamaño de fuente** (Normal, Grande, Extra Grande)
- **Modo oscuro/claro** para mejor visibilidad
- **Síntesis de voz** para leer contenido en voz alta
- **Controles de accesibilidad** siempre disponibles
- **Diseño intuitivo** con iconos grandes y colores contrastantes

### 🎨 Interfaz de Usuario
- **Diseño responsivo** que funciona en dispositivos móviles y escritorio
- **Navegación simple** con botones grandes y claros
- **Colores diferenciados** para cada curso
- **Indicadores de progreso** para seguimiento del aprendizaje
- **Gradientes suaves** para una experiencia visual agradable

### 📚 Funcionalidades Educativas
- **Cursos paso a paso** con instrucciones detalladas
- **Imágenes ilustrativas** para cada paso
- **Videos explicativos** (cuando están disponibles)
- **Progreso de curso** con indicadores visuales
- **Repetición ilimitada** de contenido

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 14** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Radix UI** - Componentes accesibles
- **Lucide React** - Iconos
- **Geist Font** - Tipografía moderna

### Backend y Base de Datos
- **Supabase** - Base de datos PostgreSQL y autenticación
- **Edge Functions** - Funciones serverless
- **SQL Scripts** - Configuración de base de datos

### Características Técnicas
- **Modo de respaldo** - Funciona sin base de datos para desarrollo
- **API de síntesis de voz** - Web Speech API
- **Almacenamiento local** - Persistencia de preferencias
- **Formularios reactivos** - React Hook Form
- **Validación** - Zod schemas
- **API de Resend** - Los Correos de contacto se mandan con Resend
- **Admin y fotos/videos** - Al crear o editar cursos acepta Links o subir videos/fotos propias

## 📁 Estructura del Proyecto

```
├── app/                    # Páginas de Next.js App Router
│   ├── admin/             # Panel de administración
│   ├── api/               # API routes
│   ├── contacto/          # Página de contacto
│   ├── cursos/            # Página de cursos y detalles
│   ├── preguntas/         # FAQ
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI base
│   ├── accessibility-controls.tsx
│   ├── admin-dashboard.tsx
│   ├── course-progress-indicator.tsx
│   ├── speech-button.tsx
│   └── video-player.tsx
├── lib/                   # Utilidades y configuración
│   ├── supabase.ts       # Cliente de Supabase
│   └── utils.ts          # Funciones utilitarias
├── scripts/              # Scripts de base de datos
├── public/               # Archivos estáticos
└── styles/               # Estilos globales
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm, yarn o pnpm
- Cuenta de Supabase (opcional para desarrollo)

### Instalación

1. **Clonar el repositorio**
```bash
git clone [url-del-repositorio]
cd adultech-cursos-original
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno** (opcional)
# Crear archivo .env.local

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

### Configuración de Base de Datos (Opcional)

Si deseas usar Supabase:

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar los scripts SQL en `scripts/`:
   - `setup-database.sql` - Estructura de tablas
   - `insert-curso-editable.sql` - Datos de ejemplo
3. Crear un bucket en supabase
   - `Crea un bucket que se llame "media" y asignale los formatos de archivo que aceptara`
4. Configurar variables de entorno

**Nota:** La aplicación funciona sin base de datos usando datos de respaldo incluidos.

## 📖 Uso

### Para Adultos Mayores
1. **Navegar a la página principal**
2. **Explorar cursos disponibles** en la sección de cursos
3. **Seleccionar un curso** de interés
4. **Seguir los pasos** uno por uno
5. **Usar controles de accesibilidad** según necesidades
6. **Consultar FAQ** para dudas comunes
7. **Contactar** para soporte adicional

### Para Administradores
1. **Acceder al panel de administración** en `/admin`
2. **Gestionar cursos** - crear, editar, eliminar
3. **Administrar pasos** de cada curso
4. **Monitorear** el contenido educativo

## 🎯 Características de Accesibilidad Detalladas

### Controles de Accesibilidad
- **Botón flotante** siempre visible
- **Tamaño de fuente ajustable** (100%, 120%, 140%)
- **Modo oscuro** para reducir fatiga visual
- **Síntesis de voz** para contenido auditivo
- **Persistencia** de preferencias en localStorage

### Diseño Inclusivo
- **Contraste alto** en todos los elementos
- **Botones grandes** fáciles de presionar
- **Navegación simple** sin elementos complejos
- **Iconos descriptivos** para mejor comprensión
- **Texto claro** y lenguaje sencillo

## 🤝 Contribución

Este proyecto está diseñado para ser educativo y accesible. Las contribuciones son bienvenidas, especialmente:

- Mejoras en accesibilidad
- Nuevos cursos educativos
- Optimizaciones de UI/UX
- Correcciones de bugs
- Documentación adicional

## 📄 Licencia

Este proyecto es un proyecto para presentar en la competencia TP 21

## 👨‍💻 Autor

**Miguel Figueroa LBIC 4°G 2025**

## 📞 Soporte

Para soporte técnico o consultas sobre el uso de la plataforma, utiliza el formulario de contacto disponible en la aplicación.

---

*AdulTech Cursos - Conectando generaciones a través de la tecnología* 💙
