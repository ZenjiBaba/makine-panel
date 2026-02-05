// sw.js - Android Uyumlu Service Worker

// 1. Kurulum: Beklemeden aktif ol
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. Aktivasyon: Sayfayı hemen kontrol altına al
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// 3. Bildirime Tıklama Olayı (Sayfayı açar/odaklar)
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            // Eğer sayfa zaten açıksa ona odaklan
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url.indexOf(self.registration.scope) > -1 && 'focus' in client) {
                    return client.focus();
                }
            }
            // Sayfa açık değilse yeni aç
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});