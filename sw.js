const CACHE = "reinicio8-v1"
const ASSETS = ["./", "index.html", "manifest.webmanifest", "icons/icon-180.png", "icons/icon-192.png", "icons/icon-512.png", "img/ex/bridge-1.jpg", "img/ex/bridge-2.jpg", "img/ex/calf-1.jpg", "img/ex/calf-2.jpg", "img/ex/curl-1.jpg", "img/ex/curl-2.jpg", "img/ex/dead-1.jpg", "img/ex/dead-2.jpg", "img/ex/hip-1.jpg", "img/ex/hip-2.jpg", "img/ex/press-1.jpg", "img/ex/press-2.jpg", "img/ex/push-1.jpg", "img/ex/push-2.jpg", "img/ex/row-1.jpg", "img/ex/row-2.jpg", "img/ex/walk-1.jpg", "img/ex/walk-2.jpg"]

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()))
})
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()))
})
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return
  const url = new URL(e.request.url)
  if(url.origin !== location.origin) return
  // HTML: red primero (para recibir actualizaciones), cache si no hay internet
  if(e.request.mode === "navigate"){
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("./", c)); return r }).catch(() => caches.match("./")))
    return
  }
  // imágenes y demás: cache primero
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r })))
})
