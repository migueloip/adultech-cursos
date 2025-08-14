// Service Worker para funcionalidad offline
const CACHE_NAME = 'adultech-cursos-v1';
const STATIC_CACHE = 'adultech-static-v1';
const DYNAMIC_CACHE = 'adultech-dynamic-v1';

// Archivos estáticos para cachear
const STATIC_FILES = [
  '/',
  '/cursos',
  '/preguntas',
  '/contacto',
  '/images/adultech-logo.png',
  '/placeholder.svg',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Cacheando archivos estáticos');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Instalación completa');
        return self.skipWaiting();
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activación completa');
      return self.clients.claim();
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo cachear requests del mismo origen y solo GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('Service Worker: Sirviendo desde cache:', request.url);
          return cachedResponse;
        }

        // Si no está en cache, hacer fetch y cachear
        return fetch(request)
          .then((response) => {
            // Solo cachear respuestas exitosas
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta
            const responseToCache = response.clone();

            // Determinar qué cache usar
            let cacheName = DYNAMIC_CACHE;
            if (STATIC_FILES.includes(url.pathname)) {
              cacheName = STATIC_CACHE;
            }

            caches.open(cacheName)
              .then((cache) => {
                console.log('Service Worker: Cacheando:', request.url);
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Si falla el fetch y es una página, mostrar página offline
            if (request.destination === 'document') {
              return caches.match('/');
            }
            // Para otros recursos, devolver placeholder si existe
            if (request.destination === 'image') {
              return caches.match('/placeholder.svg');
            }
          });
      })
  );
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_COURSE') {
    const { courseId, courseData } = event.data;
    
    caches.open(DYNAMIC_CACHE)
      .then((cache) => {
        // Cachear datos del curso
        const courseUrl = `/api/cursos/${courseId}`;
        const response = new Response(JSON.stringify(courseData), {
          headers: { 'Content-Type': 'application/json' }
        });
        
        cache.put(courseUrl, response);
        console.log('Service Worker: Curso cacheado:', courseId);
        
        // Notificar al cliente que el curso fue cacheado
        event.ports[0].postMessage({ success: true, courseId });
      })
      .catch((error) => {
        console.error('Error cacheando curso:', error);
        event.ports[0].postMessage({ success: false, error: error.message });
      });
  }
  
  if (event.data && event.data.type === 'GET_CACHED_COURSES') {
    caches.open(DYNAMIC_CACHE)
      .then((cache) => {
        return cache.keys();
      })
      .then((keys) => {
        const courseKeys = keys.filter(key => key.url.includes('/api/cursos/'));
        const courseIds = courseKeys.map(key => {
          const match = key.url.match(/\/api\/cursos\/(\d+)/);
          return match ? parseInt(match[1]) : null;
        }).filter(id => id !== null);
        
        event.ports[0].postMessage({ courseIds });
      });
  }
});