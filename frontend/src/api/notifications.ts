import api from '../lib/api'

export interface PushSubscriptionData {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export const notificationsApi = {
  subscribe: async (subscription: PushSubscriptionData): Promise<{ status: string }> => {
    const response = await api.post('/notifications/subscribe', subscription)
    return response.data
  },
}

