import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export default function Profile() {
  const { user } = useAuthStore()
  const { data: userData } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: authApi.getMe,
  })

  const displayUser = userData || user

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {displayUser ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.email}</p>
              </div>
              {userData?.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(userData.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>
      </div>
    </Layout>
  )
}

