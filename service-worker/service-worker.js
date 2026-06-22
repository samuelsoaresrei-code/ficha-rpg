// RPG Ablube — Service Worker
const CACHE_NAME = 'rpg-ablube-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Metal+Mania&family=Cinzel:wght@400;600;700&family=Share+Tech+Mono&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(resp => {
        if(resp && resp.status===200 && resp.type!=='opaque'){
          const clone=resp.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(e.request,clone));
        }
        return resp;
      }).catch(()=>cached||new Response('Offline',{status:503}));
    })
  );
});
