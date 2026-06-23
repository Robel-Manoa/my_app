import { AnnouncementProps } from '../../domain/entities/Announcement'
import { DepartmentProps } from '../../domain/entities/Department'
import { EmployeeProps } from '../../domain/entities/Employee'
import { FeedbackProps } from '../../domain/entities/Feedback'
import { UserAccountProps } from '../../domain/entities/UserAccount'

const now = new Date().toISOString()

export const departments: DepartmentProps[] = [
  { id: 'dept-hr', name: 'Human Resources', code: 'HR', description: 'People operations and company policies', active: true, createdAt: now, updatedAt: now },
  { id: 'dept-fin', name: 'Finance', code: 'FIN', description: 'Accounting, payroll, and financial governance', active: true, createdAt: now, updatedAt: now },
  { id: 'dept-it', name: 'Information Technology', code: 'IT', description: 'Internal systems and employee support', active: true, createdAt: now, updatedAt: now },
]

export const employees: EmployeeProps[] = [
  { id: 'emp-hr-admin', userId: 'user-hr', firstName: 'Alicia', lastName: 'Nair', email: 'hr.admin@company.test', jobTitle: 'HR Operations Lead', departmentId: 'dept-hr', status: 'ACTIVE', salaryBand: 'M4', createdAt: now, updatedAt: now },
  { id: 'emp-fin-admin', userId: 'user-fin-admin', firstName: 'Dev', lastName: 'Ramdin', email: 'finance.admin@company.test', jobTitle: 'Finance Department Admin', departmentId: 'dept-fin', status: 'ACTIVE', salaryBand: 'M3', createdAt: now, updatedAt: now },
  { id: 'emp-employee', userId: 'user-employee', firstName: 'Maya', lastName: 'Peer', email: 'employee@company.test', jobTitle: 'Accounts Officer', departmentId: 'dept-fin', managerId: 'emp-fin-admin', status: 'ACTIVE', salaryBand: 'P2', createdAt: now, updatedAt: now },
  { id: 'emp-it', userId: 'user-it', firstName: 'Noah', lastName: 'Seeborun', email: 'noah.it@company.test', jobTitle: 'Systems Analyst', departmentId: 'dept-it', status: 'ON_LEAVE', salaryBand: 'P3', createdAt: now, updatedAt: now },
]

export const users: UserAccountProps[] = [
  { id: 'user-hr', email: 'hr.admin@company.test', displayName: 'Alicia Nair', role: 'HR_ADMIN', departmentId: 'dept-hr', employeeId: 'emp-hr-admin', active: true },
  { id: 'user-fin-admin', email: 'finance.admin@company.test', displayName: 'Dev Ramdin', role: 'DEPARTMENT_ADMIN', departmentId: 'dept-fin', employeeId: 'emp-fin-admin', active: true },
  { id: 'user-employee', email: 'employee@company.test', displayName: 'Maya Peer', role: 'EMPLOYEE', departmentId: 'dept-fin', employeeId: 'emp-employee', active: true },
  { id: 'user-it', email: 'noah.it@company.test', displayName: 'Noah Seeborun', role: 'EMPLOYEE', departmentId: 'dept-it', employeeId: 'emp-it', active: true },
]

export const announcements: AnnouncementProps[] = [
  { id: 'ann-1', title: 'Quarterly town hall', body: 'Join the company town hall this Friday at 10:00 for business updates.', status: 'PUBLISHED', authorId: 'user-hr', publishedAt: now, createdAt: now, updatedAt: now },
  { id: 'ann-2', title: 'Finance month end checklist', body: 'Finance team members should complete their month end controls by Thursday.', status: 'PUBLISHED', authorId: 'user-fin-admin', departmentId: 'dept-fin', publishedAt: now, createdAt: now, updatedAt: now },
  { id: 'ann-3', title: 'Policy draft', body: 'Draft annual leave policy clarification awaiting HR review.', status: 'DRAFT', authorId: 'user-hr', departmentId: 'dept-hr', createdAt: now, updatedAt: now },
]

export const feedbacks: FeedbackProps[] = [
  { id: 'fb-1', employeeId: 'emp-employee', departmentId: 'dept-fin', subject: 'Payroll calendar', message: 'It would help to publish payroll cutoff dates earlier each month.', status: 'SUBMITTED', createdAt: now, updatedAt: now },
  { id: 'fb-2', employeeId: 'emp-it', departmentId: 'dept-it', subject: 'Laptop replacement', message: 'The self-service process for laptop replacement was clear and quick.', status: 'REVIEWED', reviewerId: 'user-hr', reviewNote: 'Positive feedback shared with IT service owner.', createdAt: now, updatedAt: now },
]
