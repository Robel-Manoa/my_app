import { DataProvider } from 'react-admin'
import { apiFetch, resourcePath } from './api'

const pathFor = (resource: string) => resourcePath[resource] || `/${resource}`
const withTotal = (data: any[]) => ({ data, total: data.length })

export const dataProvider: DataProvider = {
  async getList(resource) {
    const data = await apiFetch(pathFor(resource))
    return withTotal(data)
  },
  async getOne(resource, params) {
    const rows = await apiFetch(pathFor(resource))
    const record = rows.find((item: any) => item.id === params.id)
    return { data: record }
  },
  async getMany(resource, params) {
    const rows = await apiFetch(pathFor(resource))
    return { data: rows.filter((item: any) => params.ids.includes(item.id)) }
  },
  async getManyReference(resource) {
    const data = await apiFetch(pathFor(resource))
    return withTotal(data)
  },
  async create(resource, params) {
    const data = await apiFetch(pathFor(resource), { method: 'POST', body: JSON.stringify(params.data) })
    return { data }
  },
  async update(resource, params) {
    const data = await apiFetch(`${pathFor(resource)}/${params.id}`, { method: 'PUT', body: JSON.stringify(params.data) })
    return { data }
  },
  async updateMany(resource, params) {
    await Promise.all(params.ids.map((id) => apiFetch(`${pathFor(resource)}/${id}`, { method: 'PUT', body: JSON.stringify(params.data) })))
    return { data: params.ids }
  },
  async delete(resource, params) {
    await apiFetch(`${pathFor(resource)}/${params.id}`, { method: 'DELETE' })
    return { data: params.previousData }
  },
  async deleteMany(resource, params) {
    await Promise.all(params.ids.map((id) => apiFetch(`${pathFor(resource)}/${id}`, { method: 'DELETE' })))
    return { data: params.ids }
  },
}
