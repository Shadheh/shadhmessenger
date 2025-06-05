self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("shadh-cache").then(cache => {
      return cache.addAll(["/", "/style.css", "/socket.io/socket.io.js"]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
