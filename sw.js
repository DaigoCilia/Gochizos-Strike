const CACHE_NAME = "mi-juego-cache-v1";

// archivos importantes del juego todos, incluye assets, html, js, musica, iconos, etc
const FILES_TO_CACHE = [
  "/",
  "/index.html",
    "/main.js",
    "/boot.js",
    "/inicio.js",
    "/skins.js",
    "/carga.js",
    "/juego.js",
    "/manifest.json",
    
  "https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.js"
];

// instalar el service worker
//Evento que se ejecuta una sola vez, cuando el Service Worker se instala
//Muestra en consola un mensaje en consola indicando que el Service Worker se ha instalado
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();//Activa el inmediatamente del nuevo Service Worker, sin esperar a que el anterior se cierre
});

// activar el service worker
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); //Borramos el cache antiguo
          }
        })
      );
    })
  );
  self.clients.claim(); //Controlamos la app sin recargar
});

// interceptar peticiones
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {

      // si existe en cache, lo usa
      if (response) {
        return response;
      }

      // si no existe, lo descarga
      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
    })
  );
});