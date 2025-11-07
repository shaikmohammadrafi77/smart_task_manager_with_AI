interface AnalyticsCardsProps {
  data?: {
    total_tasks: number
    completed_tasks: number
    overdue_tasks: number
    completion_rate: number
  }
}

export default function AnalyticsCards({ data }: AnalyticsCardsProps) {
  if (!data) return null

  const cards = [
    {
      title: 'Total Tasks',
      value: data.total_tasks,
      color: 'bg-blue-500',
    },
    {
      title: 'Completed',
      value: data.completed_tasks,
      color: 'bg-green-500',
    },
    {
      title: 'Overdue',
      value: data.overdue_tasks,
      color: 'bg-red-500',
    },
    {
      title: 'Completion Rate',
      value: `${data.completion_rate.toFixed(1)}%`,
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            </div>
            <div className={`${card.color} rounded-full p-3`}>
              <span className="text-white text-2xl">📊</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

