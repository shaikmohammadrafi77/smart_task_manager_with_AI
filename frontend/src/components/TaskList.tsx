import { format } from 'date-fns'
import { type Task, type Priority, type Status } from '../api/tasks'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
}

export default function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const priorityColors: Record<Priority, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800',
  }

  const statusColors: Record<Status, string> = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        No tasks found. Create your first task!
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <div key={task.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      priorityColors[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      statusColors[task.status]
                    }`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                )}
                <div className="flex gap-4 text-xs text-gray-500">
                  {task.due_at && (
                    <span>Due: {format(new Date(task.due_at), 'MMM d, yyyy h:mm a')}</span>
                  )}
                  {task.remind_at && (
                    <span>Remind: {format(new Date(task.remind_at), 'MMM d, yyyy h:mm a')}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => onEdit(task)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

