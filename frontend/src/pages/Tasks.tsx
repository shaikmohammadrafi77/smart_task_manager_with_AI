import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Layout from '../components/Layout'
import { tasksApi, type Task, type Priority, type Status } from '../api/tasks'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import TaskFilters from '../components/TaskFilters'

export default function Tasks() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<{
    status?: Status
    priority?: Priority
  }>({})

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.list(filters),
  })

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingTask(null)
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + New Task
          </button>
        </div>

        <TaskFilters filters={filters} onFiltersChange={setFilters} />

        {showForm && (
          <TaskForm
            task={editingTask}
            onClose={handleFormClose}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['tasks'] })
              handleFormClose()
            }}
          />
        )}

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  )
}

