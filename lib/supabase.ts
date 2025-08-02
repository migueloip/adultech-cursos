import { createClient } from "@supabase/supabase-js"

// Verificar si las variables de entorno están disponibles
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Si no hay variables de entorno, usar configuración local/demo
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

let supabase: any = null

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl!, supabaseAnonKey!)
} else {
  console.warn("Supabase no configurado - usando datos de respaldo")
  // Cliente mock para desarrollo local
  supabase = {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "No database" } }),
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: "No database" } }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: "No database" } }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  }
}

export { supabase, isSupabaseConfigured }

export type Curso = {
  id: number
  titulo: string
  descripcion: string
  icono: string
  color: string
  icon_color: string
  video_url?: string
  created_at: string
  updated_at: string
}

export type CursoPaso = {
  id: number
  curso_id: number
  orden: number
  titulo: string
  descripcion: string
  imagen_url?: string
  created_at: string
}

// Datos de respaldo para cuando no hay base de datos
export const cursosRespaldo: Curso[] = [
  {
    id: 1,
    titulo: "Cómo encender y apagar el teléfono",
    descripcion: "Aprende los primeros pasos para usar tu teléfono Android",
    icono: "Smartphone",
    color: "bg-green-100 border-green-300",
    icon_color: "text-green-600",
    video_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    titulo: "Cómo hacer llamadas",
    descripcion: "Descubre cómo llamar a tus seres queridos de forma fácil",
    icono: "Phone",
    color: "bg-blue-100 border-blue-300",
    icon_color: "text-blue-600",
    video_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    titulo: "Cómo enviar mensajes",
    descripcion: "Envía mensajes de texto paso a paso",
    icono: "MessageSquare",
    color: "bg-purple-100 border-purple-300",
    icon_color: "text-purple-600",
    video_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    titulo: "Cómo usar WhatsApp",
    descripcion: "Conecta con familia y amigos a través de WhatsApp",
    icono: "MessageSquare",
    color: "bg-emerald-100 border-emerald-300",
    icon_color: "text-emerald-600",
    video_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    titulo: "Cómo conectarse a Wi-Fi",
    descripcion: "Conecta tu teléfono a internet de forma segura",
    icono: "Wifi",
    color: "bg-orange-100 border-orange-300",
    icon_color: "text-orange-600",
    video_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    titulo: "Cómo usar la cámara",
    descripcion: "Toma fotos y videos para guardar tus momentos especiales",
    icono: "Camera",
    color: "bg-pink-100 border-pink-300",
    icon_color: "text-pink-600",
    video_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const pasosRespaldo: { [key: number]: CursoPaso[] } = {
  1: [
    {
      id: 1,
      curso_id: 1,
      orden: 1,
      titulo: "Paso 1: Ubicar el botón de encendido",
      descripcion:
        "El botón de encendido generalmente se encuentra en el lado derecho de tu teléfono. Es un botón más grande que los demás.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Botón+de+encendido",
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      curso_id: 1,
      orden: 2,
      titulo: "Paso 2: Encender el teléfono",
      descripcion:
        "Presiona y mantén presionado el botón de encendido durante 3 segundos hasta que veas la pantalla iluminarse.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Presionar+botón",
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      curso_id: 1,
      orden: 3,
      titulo: "Paso 3: Apagar el teléfono",
      descripcion:
        "Para apagar, presiona y mantén el botón de encendido hasta que aparezca un menú. Luego toca 'Apagar'.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Menú+apagar",
      created_at: new Date().toISOString(),
    },
  ],
  2: [
    {
      id: 4,
      curso_id: 2,
      orden: 1,
      titulo: "Paso 1: Abrir la aplicación de teléfono",
      descripcion: "Busca el ícono verde con un teléfono en tu pantalla principal y tócalo una vez.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Ícono+teléfono",
      created_at: new Date().toISOString(),
    },
    {
      id: 5,
      curso_id: 2,
      orden: 2,
      titulo: "Paso 2: Marcar el número",
      descripcion: "Usa el teclado numérico para escribir el número de teléfono que quieres llamar.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Teclado+numérico",
      created_at: new Date().toISOString(),
    },
    {
      id: 6,
      curso_id: 2,
      orden: 3,
      titulo: "Paso 3: Realizar la llamada",
      descripcion: "Presiona el botón verde con el ícono de teléfono para iniciar la llamada.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Botón+llamar",
      created_at: new Date().toISOString(),
    },
  ],
  3: [
    {
      id: 7,
      curso_id: 3,
      orden: 1,
      titulo: "Paso 1: Abrir mensajes",
      descripcion: "Busca el ícono de mensajes (generalmente parece una burbuja de conversación) y tócalo.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Ícono+mensajes",
      created_at: new Date().toISOString(),
    },
    {
      id: 8,
      curso_id: 3,
      orden: 2,
      titulo: "Paso 2: Crear nuevo mensaje",
      descripcion: "Toca el botón '+' o 'Nuevo mensaje' para comenzar a escribir.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Nuevo+mensaje",
      created_at: new Date().toISOString(),
    },
    {
      id: 9,
      curso_id: 3,
      orden: 3,
      titulo: "Paso 3: Escribir y enviar",
      descripcion: "Escribe tu mensaje y presiona el botón 'Enviar' (generalmente una flecha).",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Escribir+mensaje",
      created_at: new Date().toISOString(),
    },
  ],
  4: [
    {
      id: 10,
      curso_id: 4,
      orden: 1,
      titulo: "Paso 1: Abrir WhatsApp",
      descripcion: "Busca el ícono verde de WhatsApp en tu teléfono y tócalo para abrirlo.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Ícono+WhatsApp",
      created_at: new Date().toISOString(),
    },
    {
      id: 11,
      curso_id: 4,
      orden: 2,
      titulo: "Paso 2: Seleccionar contacto",
      descripcion: "Toca en el nombre de la persona con quien quieres chatear.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Lista+contactos",
      created_at: new Date().toISOString(),
    },
    {
      id: 12,
      curso_id: 4,
      orden: 3,
      titulo: "Paso 3: Enviar mensaje",
      descripcion: "Escribe tu mensaje en la parte inferior y toca el botón de enviar.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Chat+WhatsApp",
      created_at: new Date().toISOString(),
    },
  ],
  5: [
    {
      id: 13,
      curso_id: 5,
      orden: 1,
      titulo: "Paso 1: Abrir configuración",
      descripcion: "Busca el ícono de configuración (parece un engranaje) y tócalo.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Configuración",
      created_at: new Date().toISOString(),
    },
    {
      id: 14,
      curso_id: 5,
      orden: 2,
      titulo: "Paso 2: Buscar Wi-Fi",
      descripcion: "Busca la opción 'Wi-Fi' o 'Conexiones' y tócala.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Menú+Wi-Fi",
      created_at: new Date().toISOString(),
    },
    {
      id: 15,
      curso_id: 5,
      orden: 3,
      titulo: "Paso 3: Conectar a red",
      descripcion: "Selecciona tu red Wi-Fi e ingresa la contraseña si es necesario.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Conectar+Wi-Fi",
      created_at: new Date().toISOString(),
    },
  ],
  6: [
    {
      id: 16,
      curso_id: 6,
      orden: 1,
      titulo: "Paso 1: Abrir la cámara",
      descripcion: "Busca el ícono de la cámara en tu pantalla y tócalo para abrirla.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Ícono+cámara",
      created_at: new Date().toISOString(),
    },
    {
      id: 17,
      curso_id: 6,
      orden: 2,
      titulo: "Paso 2: Enfocar la imagen",
      descripcion: "Apunta la cámara hacia lo que quieres fotografiar y toca la pantalla para enfocar.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Enfocar+cámara",
      created_at: new Date().toISOString(),
    },
    {
      id: 18,
      curso_id: 6,
      orden: 3,
      titulo: "Paso 3: Tomar la foto",
      descripcion: "Presiona el botón circular grande en la parte inferior para tomar la foto.",
      imagen_url: "/placeholder.svg?height=300&width=400&text=Botón+foto",
      created_at: new Date().toISOString(),
    },
  ],
}
