import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface TasksChartProps {
  data?: {
    tasks_per_day: Record<string, number>
  }
}

export default function TasksChart({ data }: TasksChartProps) {
  if (!data || !data.tasks_per_day) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Tasks Created (Last 14 Days)</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No task data available
        </div>
      </div>
    )
  }

  const dates = Object.keys(data.tasks_per_day || {}).sort()
  const counts = dates.map((date) => data.tasks_per_day[date])

  if (dates.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Tasks Created (Last 14 Days)</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No tasks created in the last 14 days
        </div>
      </div>
    )
  }

  const chartData = {
    labels: dates.map((date) => new Date(date).toLocaleDateString()),
    datasets: [
      {
        label: 'Tasks Created',
        data: counts,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tasks Created (Last 14 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Line data={chartData} options={options} />
    </div>
  )
}

