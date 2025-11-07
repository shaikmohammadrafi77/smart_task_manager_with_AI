import { type Priority, type Status } from '../api/tasks'

interface TaskFiltersProps {
  filters: {
    status?: Status
    priority?: Priority
  }
  onFiltersChange: (filters: { status?: Status; priority?: Priority }) => void
}

export default function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: e.target.value ? (e.target.value as Status) : undefined,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={filters.priority || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                priority: e.target.value ? (e.target.value as Priority) : undefined,
              })
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        {(filters.status || filters.priority) && (
          <div className="flex items-end">
            <button
              onClick={() => onFiltersChange({})}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

