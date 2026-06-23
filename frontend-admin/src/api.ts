const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const getToken = () => localStorage.getItem('portalToken') || ''

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { 'X-User-Id': getToken() } : {}),
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

export const resourcePath: Record<string, string> = {
  departments: '/departments',
  employees: '/employees',
  announcements: '/announcements',
  feedback: '/feedback',
  users: '/users',
}
