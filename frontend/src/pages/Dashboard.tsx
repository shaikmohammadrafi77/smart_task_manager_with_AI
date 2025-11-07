import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { analyticsApi } from '../api/analytics'
import AnalyticsCards from '../components/AnalyticsCards'
import TasksChart from '../components/TasksChart'
import UpcomingDeadlines from '../components/UpcomingDeadlines'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: analyticsApi.getSummary,
  })

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading...</div>
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

