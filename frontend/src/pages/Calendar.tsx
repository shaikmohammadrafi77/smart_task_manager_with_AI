import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { tasksApi, type Task } from '../api/tasks'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  // Set end of month to end of day for proper filtering
  const monthEndAdjusted = new Date(monthEnd)
  monthEndAdjusted.setHours(23, 59, 59, 999)

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', 'calendar', monthStart.toISOString(), monthEndAdjusted.toISOString()],
    queryFn: () => tasksApi.list({ 
      due_from: monthStart.toISOString(),
      due_to: monthEndAdjusted.toISOString(),
    }),
  })

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const firstDayOfWeek = monthStart.getDay()
  
  // Get tasks for a specific day
  const getTasksForDay = (day: Date): Task[] => {
    if (!tasks) return []
    return tasks.filter((task) => {
      if (!task.due_at) return false
      return isSameDay(new Date(task.due_at), day)
    })
  }

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading calendar...</div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Previous month"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Next month"
            >
              →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month start */}
              {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="h-24 border border-gray-200 rounded-lg" />
              ))}

              {/* Days of the month */}
              {days.map((day) => {
                const dayTasks = getTasksForDay(day)
                const isToday = isSameDay(day, new Date())
                const isCurrentMonth = isSameMonth(day, currentDate)

                return (
                  <div
                    key={day.toISOString()}
                    className={`h-24 border rounded-lg p-2 overflow-y-auto ${
                      isToday
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          className={`text-xs px-2 py-1 rounded border ${getPriorityColor(
                            task.priority
                          )} truncate`}
                          title={task.title}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-500 px-2">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Priority Legend</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
              <span className="text-sm text-gray-600">High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
              <span className="text-sm text-gray-600">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm text-gray-600">Low</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
