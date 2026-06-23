import {
  AnnouncementProps,
} from '../../domain/entities/Announcement'
import { DepartmentProps } from '../../domain/entities/Department'
import { EmployeeProps } from '../../domain/entities/Employee'
import { FeedbackProps } from '../../domain/entities/Feedback'
import { UserAccountProps } from '../../domain/entities/UserAccount'
import {
  AnnouncementRepository,
  DepartmentRepository,
  EmployeeRepository,
  FeedbackRepository,
  UserRepository,
} from '../../ports/Repositories'
import { MemoryDatabase } from '../../infrastructure/database/MemoryDatabase'

export class MemoryDepartmentRepository implements DepartmentRepository {
  constructor(private readonly db: MemoryDatabase) {}
  async list() { return [...this.db.departments.values()] }
  async findById(id: string) { return this.db.departments.get(id) }
  async findByCode(code: string) { return [...this.db.departments.values()].find((item) => item.code === code.toUpperCase()) }
  async save(department: DepartmentProps) {
    this.db.departments.set(department.id, department)
    return department
  }
  async delete(id: string) { this.db.departments.delete(id) }
}

export class MemoryEmployeeRepository implements EmployeeRepository {
  constructor(private readonly db: MemoryDatabase) {}
  async list() { return [...this.db.employees.values()] }
  async findById(id: string) { return this.db.employees.get(id) }
  async findByUserId(userId: string) { return [...this.db.employees.values()].find((item) => item.userId === userId) }
  async save(employee: EmployeeProps) {
    this.db.employees.set(employee.id, employee)
    return employee
  }
  async delete(id: string) { this.db.employees.delete(id) }
}

export class MemoryUserRepository implements UserRepository {
  constructor(private readonly db: MemoryDatabase) {}
  async list() { return [...this.db.users.values()] }
  async findById(id: string) { return this.db.users.get(id) }
  async findByEmail(email: string) { return [...this.db.users.values()].find((item) => item.email === email.toLowerCase()) }
  async save(user: UserAccountProps) {
    this.db.users.set(user.id, user)
    return user
  }
}

export class MemoryAnnouncementRepository implements AnnouncementRepository {
  constructor(private readonly db: MemoryDatabase) {}
  async list() { return [...this.db.announcements.values()] }
  async findById(id: string) { return this.db.announcements.get(id) }
  async save(announcement: AnnouncementProps) {
    this.db.announcements.set(announcement.id, announcement)
    return announcement
  }
  async delete(id: string) { this.db.announcements.delete(id) }
}

export class MemoryFeedbackRepository implements FeedbackRepository {
  constructor(private readonly db: MemoryDatabase) {}
  async list() { return [...this.db.feedbacks.values()] }
  async findById(id: string) { return this.db.feedbacks.get(id) }
  async save(feedback: FeedbackProps) {
    this.db.feedbacks.set(feedback.id, feedback)
    return feedback
  }
}
