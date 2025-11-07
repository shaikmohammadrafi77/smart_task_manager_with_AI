import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { tasksApi, type Task, type TaskCreate, type TaskUpdate, type Priority } from '../api/tasks'
import { aiApi } from '../api/ai'

interface TaskFormProps {
  task?: Task | null
  onClose: () => void
  onSuccess: () => void
}

export default function TaskForm({ task, onClose, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueAt, setDueAt] = useState('')
  const [remindAt, setRemindAt] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setDueAt(task.due_at ? new Date(task.due_at).toISOString().slice(0, 16) : '')
      setRemindAt(task.remind_at ? new Date(task.remind_at).toISOString().slice(0, 16) : '')
    }
  }, [task])

  const createMutation = useMutation({
    mutationFn: (data: TaskCreate) => tasksApi.create(data),
    onSuccess,
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; update: TaskUpdate }) =>
      tasksApi.update(data.id, data.update),
    onSuccess,
  })

  const handleAISuggest = async () => {
    if (!title.trim()) {
      alert('Please enter a task title first')
      return
    }

    setLoadingAI(true)
    try {
      const suggestion = await aiApi.suggest({
        title,
        description,
      })
      setPriority(suggestion.suggested_priority as Priority)
      if (suggestion.suggested_time_slots.length > 0) {
        const slot = suggestion.suggested_time_slots[0]
        setDueAt(new Date(slot.start).toISOString().slice(0, 16))
        setRemindAt(new Date(slot.start).toISOString().slice(0, 16))
      }
      alert(`AI Suggestion: ${suggestion.priority_reason}\n${suggestion.reasoning}`)
    } catch (error) {
      console.error('AI suggestion error:', error)
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data: TaskCreate | TaskUpdate = {
      title,
      description: description || undefined,
      priority,
      due_at: dueAt ? new Date(dueAt).toISOString() : undefined,
      remind_at: remindAt ? new Date(remindAt).toISOString() : undefined,
    }

    if (task) {
      updateMutation.mutate({ id: task.id, update: data })
    } else {
      createMutation.mutate(data as TaskCreate)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={loadingAI}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                {loadingAI ? 'Loading...' : '🤖 AI Suggest'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remind At</label>
            <input
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : task
                  ? 'Update'
                  : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

