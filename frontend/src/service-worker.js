/// <reference lib="webworker" />

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() || {}
  const title = data.title || 'Task Reminder'
  const options: NotificationOptions = {
    body: data.body || 'You have a task reminder',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: data,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('/tasks')
  )
})

