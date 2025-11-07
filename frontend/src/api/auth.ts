import api from '../lib/api'

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface LoginData {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface UserResponse {
  id: number
  email: string
  name: string
  created_at: string
}

export const authApi = {
  register: async (data: RegisterData): Promise<UserResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  login: async (data: LoginData): Promise<TokenResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  getMe: async (): Promise<UserResponse> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

