import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { analyticsApi } from '../api/analytics'
import AnalyticsCards from '../components/AnalyticsCards'
import TasksChart from '../components/TasksChart'
import UpcomingDeadlines from '../components/UpcomingDeadlines'

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: analyticsApi.getSummary,
    retry: 2,
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <div className="text-gray-500">Loading dashboard...</div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Dashboard</h3>
            <p className="text-sm text-red-700">
              Failed to load dashboard data. Please refresh the page or try again later.
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        <AnalyticsCards data={data} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TasksChart data={data} />
          <UpcomingDeadlines data={data} />
        </div>
      </div>
    </Layout>
  )
}

