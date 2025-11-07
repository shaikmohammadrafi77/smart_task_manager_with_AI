import { useState } from 'react'
import Layout from '../components/Layout'
import { notificationsApi } from '../api/notifications'

export default function Settings() {
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
            ? new Uint8Array(
                JSON.parse(
                  `[${import.meta.env.VITE_VAPID_PUBLIC_KEY.match(/.{1,2}/g)?.join(',') || ''}]`
                )
              )
            : undefined,
        })

        const subscriptionData = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: btoa(
              String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh') || new ArrayBuffer(0)))
            ),
            auth: btoa(
              String.fromCharCode(...new Uint8Array(subscription.getKey('auth') || new ArrayBuffer(0)))
            ),
          },
        }

        await notificationsApi.subscribe(subscriptionData)
        setIsSubscribed(true)
        alert('Successfully subscribed to push notifications!')
      } catch (error) {
        console.error('Error subscribing to push notifications:', error)
        alert('Failed to subscribe to push notifications')
      }
    } else {
      alert('Push notifications are not supported in your browser')
    }
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Web Push Notifications
              </label>
              <button
                onClick={handleSubscribe}
                disabled={isSubscribed}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe to Push Notifications'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
          <p className="text-gray-500 text-sm">
            Email notifications will be sent if SMTP is configured on the server.
          </p>
        </div>
      </div>
    </Layout>
  )
}

