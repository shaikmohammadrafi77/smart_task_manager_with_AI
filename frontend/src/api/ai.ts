import api from '../lib/api'

export interface TaskContext {
  title?: string
  description?: string
  estimated_duration_minutes?: number
}

export interface AISuggestion {
  suggested_priority: string
  priority_reason: string
  suggested_time_slots: Array<{
    start: string
    end: string
    confidence: number
  }>
  reasoning: string
}

export const aiApi = {
  suggest: async (context?: TaskContext): Promise<AISuggestion> => {
    const response = await api.post('/ai/suggest', context || {})
    return response.data
  },
}

