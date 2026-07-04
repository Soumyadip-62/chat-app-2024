// Import the Firebase app and messaging compat libraries
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBb_YlMcZuz8NWmyV1F2ejmRLB1SHYf8_s",
  authDomain: "chat-2024-6897a.firebaseapp.com",
  projectId: "chat-2024-6897a",
  storageBucket: "chat-2024-6897a.appspot.com",
  messagingSenderId: "837498699064",
  appId: "1:837498699064:web:d700aa4a28dcea666295cd"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'New Message';
  const notificationOptions = {
    body: payload.notification?.body || 'You have received a new message.',
    icon: '/logo.png', // Fallback icon path if available
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
