const CACHE_NAME = "agrosmart-v1"
const urlsToCache = ["/", "/static/js/bundle.js", "/static/css/main.css", "/agrosmart-logo.png", "/manifest.json"]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "sensor-data-sync") {
    event.waitUntil(syncSensorData())
  }
})

async function syncSensorData() {
  // Sync sensor data when back online
  try {
    const response = await fetch("/api/sync-sensor-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timestamp: Date.now() }),
    })

    if (response.ok) {
      console.log("Sensor data synced successfully")
    }
  } catch (error) {
    console.error("Failed to sync sensor data:", error)
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New alert from AgroSmart",
    icon: "/agrosmart-logo.png",
    badge: "/agrosmart-logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Alert",
        icon: "/icons/checkmark.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/xmark.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("AgroSmart Alert", options))
})

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/alerts"))
  }
})
