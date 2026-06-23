const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export interface Session {
  token: string
  user: { id: string; displayName: string; role: string; departmentId?: string; employeeId?: string }
}

export const getSession = (): Session | undefined => {
  const raw = localStorage.getItem('employeeSession')
  return raw ? JSON.parse(raw) : undefined
}

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = getSession()?.token
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'X-User-Id': token } : {}),
      ...options.headers,
    },
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(error.error || 'Request failed')
  }
  if (response.status === 204) return undefined
  return response.json()
}
