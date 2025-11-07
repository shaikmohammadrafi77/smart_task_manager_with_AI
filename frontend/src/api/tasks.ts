import api from '../lib/api'

export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in_progress' | 'done'

export interface Task {
  id: number
  user_id: number
  title: string
  description: string | null
  priority: Priority
  due_at: string | null
  remind_at: string | null
  status: Status
  created_at: string
  updated_at: string
}

export interface TaskCreate {
  title: string
  description?: string
  priority: Priority
  due_at?: string
  remind_at?: string
}

export interface TaskUpdate {
  title?: string
  description?: string
  priority?: Priority
  due_at?: string
  remind_at?: string
  status?: Status
}

export interface TaskFilters {
  status?: Status
  priority?: Priority
  due_from?: string
  due_to?: string
  page?: number
  size?: number
}

export const tasksApi = {
  list: async (filters?: TaskFilters): Promise<Task[]> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.due_from) params.append('due_from', filters.due_from)
    if (filters?.due_to) params.append('due_to', filters.due_to)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.size) params.append('size', filters.size.toString())

    const response = await api.get(`/tasks?${params.toString()}`)
    return response.data
  },

  get: async (id: number): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`)
    return response.data
  },

  create: async (data: TaskCreate): Promise<Task> => {
    const response = await api.post('/tasks', data)
    return response.data
  },

  update: async (id: number, data: TaskUpdate): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}

