import { AnnouncementProps } from '../domain/entities/Announcement'
import { DepartmentProps } from '../domain/entities/Department'
import { EmployeeProps } from '../domain/entities/Employee'
import { FeedbackProps } from '../domain/entities/Feedback'
import { UserAccountProps } from '../domain/entities/UserAccount'

export interface DepartmentRepository {
  list(): Promise<DepartmentProps[]>
  findById(id: string): Promise<DepartmentProps | undefined>
  findByCode(code: string): Promise<DepartmentProps | undefined>
  save(department: DepartmentProps): Promise<DepartmentProps>
  delete(id: string): Promise<void>
}

export interface EmployeeRepository {
  list(): Promise<EmployeeProps[]>
  findById(id: string): Promise<EmployeeProps | undefined>
  findByUserId(userId: string): Promise<EmployeeProps | undefined>
  save(employee: EmployeeProps): Promise<EmployeeProps>
  delete(id: string): Promise<void>
}

export interface UserRepository {
  list(): Promise<UserAccountProps[]>
  findById(id: string): Promise<UserAccountProps | undefined>
  findByEmail(email: string): Promise<UserAccountProps | undefined>
  save(user: UserAccountProps): Promise<UserAccountProps>
}

export interface AnnouncementRepository {
  list(): Promise<AnnouncementProps[]>
  findById(id: string): Promise<AnnouncementProps | undefined>
  save(announcement: AnnouncementProps): Promise<AnnouncementProps>
  delete(id: string): Promise<void>
}

export interface FeedbackRepository {
  list(): Promise<FeedbackProps[]>
  findById(id: string): Promise<FeedbackProps | undefined>
  save(feedback: FeedbackProps): Promise<FeedbackProps>
}
