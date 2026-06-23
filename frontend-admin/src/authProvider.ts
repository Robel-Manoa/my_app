import { AuthProvider } from 'react-admin'
import { apiFetch } from './api'

export const authProvider: AuthProvider = {
  async login({ username }) {
    const result = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: username }),
    })
    localStorage.setItem('portalToken', result.token)
    localStorage.setItem('portalUser', JSON.stringify(result.user))
  },
  async logout() {
    localStorage.removeItem('portalToken')
    localStorage.removeItem('portalUser')
  },
  async checkAuth() {
    if (!localStorage.getItem('portalToken')) throw new Error('Unauthenticated')
  },
  async checkError(error) {
    if (error.status === 401 || error.status === 403) throw error
  },
  async getIdentity() {
    const user = JSON.parse(localStorage.getItem('portalUser') || '{}')
    return { id: user.id, fullName: `${user.displayName} (${user.role})` }
  },
  async getPermissions() {
    const user = JSON.parse(localStorage.getItem('portalUser') || '{}')
    return user.role
  },
}
