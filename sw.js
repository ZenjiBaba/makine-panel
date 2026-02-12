importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyByw1MrUACV0bphoLaw8BM7_RQj_x5_21o",
    projectId: "makine-otomasyon-183ab",
    messagingSenderId: "894852236387", // Firebase Console > Project Settings > Cloud Messaging > Sender ID
    appId: "1:894852236387:web:da96448a4aaeabdc04e456" // Firebase Console > Project Settings > General > App ID
});

const messaging = firebase.messaging();

// Arka planda mesaj gelirse yakala
messaging.onBackgroundMessage(function(payload) {
  console.log('Arka plan mesajı:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/13309/13309211.png',
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

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