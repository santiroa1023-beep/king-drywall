/**
 * Este Service Worker almacena las páginas y recursos locales principales.
 *  Si una página ya se guardó en caché, podrá recuperarse sin conexión;
 *  los recursos externos, como las fotografías de Unsplash, no quedan garantizados.
 */


const CACHE_VERSION = "king-drywall-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./app-page.js",
    "./manifest.webmanifest",
    "./offline.html",
    "./assets/logo.jpeg",
    "./pages/inicio.html",
    "./pages/nosotros.html",
    "./pages/servicios.html",
    "./pages/cotizar.html",
    "./pages/solicitudes.html"
];

/* ========================================
   INSTALACIÓN: GUARDAR ARCHIVOS PRINCIPALES
======================================== */

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then((cache) => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

/* ========================================
   ACTIVACIÓN: LIMPIAR CACHÉS ANTIGUAS
======================================== */

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_VERSION)
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => self.clients.claim())
    );
});

/* ========================================
   SOLICITUDES: NAVEGACIÓN Y RECURSOS
======================================== */

self.addEventListener("fetch", (event) => {
    const request = event.request;

    // Solo manejamos solicitudes GET del mismo origen.
    if (
        request.method !== "GET" ||
        new URL(request.url).origin !== self.location.origin
    ) {
        return;
    }

    // Para las páginas HTML, intentar la red primero.
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();

                        caches.open(CACHE_VERSION)
                            .then((cache) => {
                                cache.put(request, copy);
                            });

                    }

                    return response;
                })
                .catch(async () => {
                    const cachedPage = await caches.match(request);

                    if (cachedPage) {
                        return cachedPage;
                    }

                    const offlinePage = await caches.match(
                        "./offline.html"
                    );

                    if (offlinePage) {
                        return offlinePage;
                    }

                    return new Response(
                        "No hay conexión. Comprueba tu internet e inténtalo de nuevo.",
                        {
                            status: 503,
                            headers: {
                                "Content-Type": "text/plain; charset=utf-8"
                            }
                        }
                    );
                })
        );

        return;
    }

    // Para CSS, JavaScript, logos y otros recursos:
    // utilizar primero la caché y después la red.
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((response) => {
                        if (response.ok) {
                            const copy = response.clone();

                            caches.open(CACHE_VERSION)
                                .then((cache) => {
                                    cache.put(request, copy);
                                });
                        }

                        return response;
                    });
            })
    );
});