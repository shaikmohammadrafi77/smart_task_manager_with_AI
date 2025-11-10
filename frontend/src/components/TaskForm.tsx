import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { tasksApi, type Task, type TaskCreate, type TaskUpdate, type Priority } from '../api/tasks'
import { aiApi } from '../api/ai'
import { useToastStore } from './Toast'

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
  const [aiSuggestion, setAISuggestion] = useState<{ priority: string; reasoning: string } | null>(null)
  const { addToast } = useToastStore()

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
    onSuccess: () => {
      addToast('Task created successfully!', 'success')
      onSuccess()
    },
    onError: () => {
      addToast('Failed to create task. Please try again.', 'error')
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; update: TaskUpdate }) =>
      tasksApi.update(data.id, data.update),
    onSuccess: () => {
      addToast('Task updated successfully!', 'success')
      onSuccess()
    },
    onError: () => {
      addToast('Failed to update task. Please try again.', 'error')
    },
  })

  const handleAISuggest = async () => {
    if (!title.trim()) {
      addToast('Please enter a task title first', 'warning')
      return
    }

    setLoadingAI(true)
    setAISuggestion(null)
    try {
      const suggestion = await aiApi.suggest({
        title,
        description,
      })
      setPriority(suggestion.suggested_priority as Priority)
      if (suggestion.suggested_time_slots.length > 0) {
        const slot = suggestion.suggested_time_slots[0]
        const slotDate = new Date(slot.start)
        // Validate date is not in the past
        if (slotDate > new Date()) {
          setDueAt(slotDate.toISOString().slice(0, 16))
          setRemindAt(slotDate.toISOString().slice(0, 16))
      }
      }
      setAISuggestion({
        priority: suggestion.priority_reason,
        reasoning: suggestion.reasoning,
      })
      addToast('AI suggestions applied successfully!', 'success')
    } catch (error) {
      console.error('AI suggestion error:', error)
      addToast('Failed to get AI suggestions. Please try again.', 'error')
    } finally {
      setLoadingAI(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate dates (only for new tasks or if dates are being changed)
    if (dueAt && !task) {
      // For new tasks, don't allow past dates
      const dueDate = new Date(dueAt)
      const now = new Date()
      if (dueDate < now) {
        addToast('Due date cannot be in the past', 'error')
        return
      }
    }

    if (remindAt && dueAt) {
      const remindDate = new Date(remindAt)
      const dueDate = new Date(dueAt)
      if (remindDate > dueDate) {
        addToast('Reminder date cannot be after due date', 'error')
        return
      }
    }

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
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loadingAI ? 'Loading...' : '🤖 AI Suggest'}
              </button>
            </div>
          </div>

          {aiSuggestion && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-purple-600 font-bold">🤖</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-purple-900 mb-1">AI Suggestion Applied</p>
                  <p className="text-xs text-purple-700 mb-2">{aiSuggestion.priority}</p>
                  <p className="text-xs text-purple-600">{aiSuggestion.reasoning}</p>
                </div>
                <button
                  onClick={() => setAISuggestion(null)}
                  className="text-purple-400 hover:text-purple-600"
                  aria-label="Dismiss"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              min={task ? undefined : new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remind At</label>
            <input
              type="datetime-local"
              value={remindAt}
              onChange={(e) => setRemindAt(e.target.value)}
              min={task ? undefined : new Date().toISOString().slice(0, 16)}
              max={dueAt || undefined}
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

