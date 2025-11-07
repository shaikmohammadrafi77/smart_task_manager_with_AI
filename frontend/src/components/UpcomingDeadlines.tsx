import { format } from 'date-fns'

interface UpcomingDeadlinesProps {
  data?: {
    upcoming_deadlines: Array<{
      id: number
      title: string
      due_at: string | null
      priority: string
    }>
  }
}

export default function UpcomingDeadlines({ data }: UpcomingDeadlinesProps) {
  if (!data || !data.upcoming_deadlines.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines</h3>
        <p className="text-gray-500 text-sm">No upcoming deadlines</p>
      </div>
    )
  }

  const priorityColors: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Deadlines (Next 7 Days)</h3>
      <div className="space-y-3">
        {data.upcoming_deadlines.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{task.title}</p>
              {task.due_at && (
                <p className="text-sm text-gray-500">
                  {format(new Date(task.due_at), 'MMM d, yyyy h:mm a')}
                </p>
              )}
            </div>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                priorityColors[task.priority] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

