import api from '../lib/api'

export interface AnalyticsSummary {
  total_tasks: number
  completed_tasks: number
  overdue_tasks: number
  completion_rate: number
  tasks_per_day: Record<string, number>
  upcoming_deadlines: Array<{
    id: number
    title: string
    due_at: string | null
    priority: string
  }>
}

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response = await api.get('/analytics/summary')
    return response.data
  },
}

