export type Role = 'HR_ADMIN' | 'DEPARTMENT_ADMIN' | 'EMPLOYEE'
export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type FeedbackStatus = 'SUBMITTED' | 'REVIEWED' | 'CLOSED'
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'INACTIVE'

export interface Actor {
  id: string
  email: string
  role: Role
  departmentId?: string
  employeeId?: string
}
