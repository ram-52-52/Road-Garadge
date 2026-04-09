// Minimal Firebase Messaging Service Worker for handling background notifications
// Specifically designed to catch push notification taps and alert the main React App

self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.json() : {};
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification?.title || "GarageNow Mission Alert";
  const notificationOptions = {
    body: payload.notification?.body || "New rescue request detected.",
    icon: "/vite.svg", // Fallback icon
    data: payload.data || {} // Pass job data here!
  };

  event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked!", event.notification.data);
  event.notification.close();

  // Focus or open the app and send the job data to the main window
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // 1. Try to find an already open tab
      for (const client of clientList) {
        if (client.url.includes("/") && "focus" in client) {
          client.focus();
          // Broadcast to the open tab!
          client.postMessage({
            type: "FCM_NOTIFICATION_CLICK_JOB",
            jobId: event.notification.data?.jobId,
            jobData: event.notification.data // Entire payload to populate modal early if needed
          });
          return;
        }
      }
      
      // 2. If app is completely closed, open a new window pointing to the mechanic dashboard
      if (clients.openWindow) {
        // You could append ?jobId=... but postMessage is cleaner if the app handles it.
        // Or if they click, they just open the dashboard.
        return clients.openWindow("/mechanic/dashboard");
      }
    })
  );
});
