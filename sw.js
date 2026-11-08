const CACHE='yle-v2';
const CORE=['./','index.html','config.js','content.json','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
// Luôn lấy bản mới nhất khi có mạng; khi mất mạng thì dùng bản đã lưu.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(u.pathname.endsWith('/')?'./':e.request,cp))}return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
