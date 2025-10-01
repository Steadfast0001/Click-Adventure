const CACHE_NAME = "clicker-game-cache-v1"; // Consider bumping version if needed
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  
  // CRITICAL ADDITIONS for a functional PWA:
  "/supabaseClient.js", // <-- ADDED LOCAL SCRIPT
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.min.js",
];

// Install Service Worker & cache files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
        console.log("Caching essential files...");
        return cache.addAll(urlsToCache);
    }).catch(err => {
        console.error("Failed to add all URLs to cache:", err);
    })
  );
  self.skipWaiting();
});

// Serve cached content when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Update cache on new versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      )
    )
  );
  self.clients.claim();
});