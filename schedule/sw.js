self.addEventListener('install', e => {
 e.waitUntil(
   // после установки service worker
   // открыть новый кэш
   caches.open('my-pwa-cache').then(cache => {
     // добавляем все URL ресурсов, которые хотим закэшировать
     return cache.addAll([
       '/',
       '/index.html',
       '/style.css',
     ]);
   })
 );
});
