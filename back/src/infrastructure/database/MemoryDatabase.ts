import { announcements, departments, employees, feedbacks, users } from './seedData'

export class MemoryDatabase {
  departments = new Map(departments.map((item) => [item.id, { ...item }]))
  employees = new Map(employees.map((item) => [item.id, { ...item }]))
  users = new Map(users.map((item) => [item.id, { ...item }]))
  announcements = new Map(announcements.map((item) => [item.id, { ...item }]))
  feedbacks = new Map(feedbacks.map((item) => [item.id, { ...item }]))
}

export const memoryDatabase = new MemoryDatabase()
