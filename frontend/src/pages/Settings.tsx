import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { notificationsApi } from '../api/notifications'
import { useToastStore } from '../components/Toast'
import { waitForServiceWorker } from '../utils/serviceWorker'

export default function Settings() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isSupported, setIsSupported] = useState(true)
  const [isVapidConfigured, setIsVapidConfigured] = useState(false)
  const [vapidPublicKey, setVapidPublicKey] = useState<string | null>(null)
  const { addToast } = useToastStore()

  // Check VAPID key configuration on mount
  useEffect(() => {
    const checkVapidKey = async () => {
      // First check if VAPID key is in environment
      if (import.meta.env.VITE_VAPID_PUBLIC_KEY) {
        setIsVapidConfigured(true)
        setVapidPublicKey(import.meta.env.VITE_VAPID_PUBLIC_KEY)
        return
      }

      // If not in environment, try to fetch from API
      try {
        const response = await notificationsApi.getVapidPublicKey()
        if (response.public_key) {
          setIsVapidConfigured(true)
          setVapidPublicKey(response.public_key)
        }
      } catch (error) {
        // VAPID key not available from API either
        console.log('VAPID key not configured')
        setIsVapidConfigured(false)
      }
    }

    checkVapidKey()
  }, [])

  // Check if already subscribed
  useEffect(() => {
    const checkSubscription = async () => {
      // Check browser support
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setIsSupported(false)
        setIsChecking(false)
        return
      }

      try {
        // Wait for service worker to be ready (with timeout)
        const registration = await waitForServiceWorker(3000)
        
        if (!registration) {
          console.warn('Service worker not available')
          setIsChecking(false)
          return
        }

        const subscription = await registration.pushManager.getSubscription()
        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error('Error checking subscription:', error)
      } finally {
        setIsChecking(false)
      }
    }
    checkSubscription()
  }, [])

  const handleSubscribe = async () => {
    if (!isSupported) {
      addToast('Push notifications are not supported in your browser', 'error')
      return
    }

    if (!isVapidConfigured) {
      addToast(
        'Push notifications are not configured. VAPID keys are required for push notifications to work.',
        'info'
      )
      return
    }

    try {
      setIsChecking(true)
      const registration = await waitForServiceWorker(5000)
      
      if (!registration) {
        addToast('Service worker is not available. Please refresh the page.', 'error')
        setIsChecking(false)
        return
      }
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription()
      
      if (!subscription) {
        // Use VAPID key from state or environment
        const vapidKey = vapidPublicKey || import.meta.env.VITE_VAPID_PUBLIC_KEY
        
        if (!vapidKey) {
          addToast('VAPID key is not available', 'error')
          setIsChecking(false)
          return
        }

        try {
          // Convert VAPID key from base64 URL-safe to Uint8Array
          // VAPID public key is 64 bytes (x and y coordinates, 32 bytes each)
          // Browser Push API expects 65 bytes: 0x04 (uncompressed point indicator) + 64 bytes
          const base64Url = vapidKey.replace(/-/g, '+').replace(/_/g, '/')
          const padded = base64Url + '='.repeat((4 - (base64Url.length % 4)) % 4)
          const binaryString = atob(padded)
          
          // Create 65-byte array: 0x04 prefix + 64 bytes of key data
          const keyBytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            keyBytes[i] = binaryString.charCodeAt(i)
          }
          
          // Create the full key with 0x04 prefix for uncompressed point format
          const applicationServerKey = new Uint8Array(65)
          applicationServerKey[0] = 0x04 // Uncompressed point indicator
          applicationServerKey.set(keyBytes, 1)
          
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
          })
        } catch (keyError) {
          console.error('Error processing VAPID key:', keyError)
          addToast('Invalid VAPID key configuration. Please check the key format.', 'error')
          setIsChecking(false)
          return
        }
      }

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
      addToast('Successfully subscribed to push notifications!', 'success')
    } catch (error: any) {
      console.error('Error subscribing to push notifications:', error)
      if (error.name === 'NotAllowedError') {
        addToast('Notification permission denied. Please enable notifications in your browser settings.', 'error')
      } else if (error.name === 'NotSupportedError') {
        addToast('Push notifications are not supported in this browser.', 'error')
      } else {
        addToast('Failed to subscribe to push notifications. Please try again.', 'error')
      }
    } finally {
      setIsChecking(false)
    }
  }

  const handleUnsubscribe = async () => {
    try {
      setIsChecking(true)
      const registration = await waitForServiceWorker(5000)
      if (!registration) {
        addToast('Service worker is not available', 'error')
        setIsChecking(false)
        return
      }
      
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()
        setIsSubscribed(false)
        addToast('Successfully unsubscribed from push notifications', 'success')
      }
    } catch (error) {
      console.error('Error unsubscribing:', error)
      addToast('Failed to unsubscribe from push notifications', 'error')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Web Push Notifications</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Receive browser notifications for task reminders and updates.
              </p>
              
              {/* Browser Support Check */}
              {!isSupported ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    Push notifications are not supported in your browser.
                  </p>
                </div>
              ) : (
                <>
                  {/* VAPID Configuration Check */}
                  {!isVapidConfigured && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-amber-800 mb-2">
                        <strong>Configuration Required:</strong> Push notifications are not configured for this application.
                      </p>
                      <p className="text-xs text-amber-700">
                        VAPID keys need to be configured in the environment variables to enable push notifications. 
                        This is typically done by the administrator during setup.
                      </p>
                    </div>
                  )}

                  {/* Subscription Status */}
                  {isChecking ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Checking subscription status...
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 flex-wrap">
                        <button
                          onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                          disabled={isChecking || !isVapidConfigured}
                          className={`px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isSubscribed
                              ? 'bg-gray-600 text-white hover:bg-gray-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          title={!isVapidConfigured ? 'Push notifications are not configured' : ''}
                        >
                          {isSubscribed ? 'Unsubscribe' : 'Subscribe to Push Notifications'}
                        </button>
                        {isSubscribed && (
                          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <span>✓</span> Subscribed
                          </span>
                        )}
                      </div>
                      {!isVapidConfigured && (
                        <p className="text-xs text-gray-500">
                          The subscribe button is disabled because VAPID keys are not configured.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Email notifications are automatically sent for task reminders when SMTP is configured on the server.
          </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> To enable email notifications, your administrator needs to configure SMTP settings on the server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

