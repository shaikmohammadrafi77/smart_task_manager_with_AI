/**
 * Service Worker utility functions
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    })
    return registration
  } catch (error) {
    console.error('Service Worker registration failed:', error)
    return null
  }
}

export async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  try {
    // Check if service worker is already registered
    const registration = await navigator.serviceWorker.ready
    return registration
  } catch (error) {
    console.error('Service Worker not ready:', error)
    // Try to register if not ready
    return await registerServiceWorker()
  }
}

export async function waitForServiceWorker(timeout: number = 5000): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  try {
    // Try to get ready registration immediately
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<ServiceWorkerRegistration | null>((resolve) => {
        setTimeout(() => resolve(null), timeout)
      }),
    ])
    return registration
  } catch (error) {
    console.error('Error waiting for service worker:', error)
    return null
  }
}

