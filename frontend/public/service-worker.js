// public/service-worker.js
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Smart Task Organizer";
  const options = {
    body: data.body || "You have a new task reminder!",
    icon: "/vite.svg", // you can replace with your custom app icon
    badge: "/vite.svg",
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("http://localhost:5173/tasks") // redirect to your tasks page
  );
});
