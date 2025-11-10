interface AnalyticsCardsProps {
  data?: {
    total_tasks: number
    completed_tasks: number
    overdue_tasks: number
    completion_rate: number
  }
}

export default function AnalyticsCards({ data }: AnalyticsCardsProps) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Tasks',
      value: data.total_tasks ?? 0,
      color: 'bg-blue-500',
      icon: '📊',
    },
    {
      title: 'Completed',
      value: data.completed_tasks ?? 0,
      color: 'bg-green-500',
      icon: '✓',
    },
    {
      title: 'Overdue',
      value: data.overdue_tasks ?? 0,
      color: 'bg-red-500',
      icon: '⚠',
    },
    {
      title: 'Completion Rate',
      value: `${(data.completion_rate ?? 0).toFixed(1)}%`,
      color: 'bg-purple-500',
      icon: '📈',
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
              <span className="text-white text-2xl">{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

