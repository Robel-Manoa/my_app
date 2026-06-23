import { DomainError } from '../exceptions/DomainError'
import { EmployeeStatus } from '../model/types'

export interface EmployeeProps {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  departmentId: string
  managerId?: string
  status: EmployeeStatus
  salaryBand?: string
  createdAt: string
  updatedAt: string
}

export class Employee {
  private constructor(private readonly props: EmployeeProps) {}

  static create(input: Omit<EmployeeProps, 'createdAt' | 'updatedAt' | 'status'> & { status?: EmployeeStatus }) {
    Employee.assertIdentity(input.firstName, input.lastName, input.email)
    if (!input.departmentId) {
      throw new DomainError('Employee must be assigned to a department', 'EMPLOYEE_REQUIRES_DEPARTMENT')
    }
    const now = new Date().toISOString()
    return new Employee({ ...input, status: input.status ?? 'ACTIVE', createdAt: now, updatedAt: now })
  }

  static rehydrate(props: EmployeeProps) {
    return new Employee(props)
  }

  update(input: Partial<Omit<EmployeeProps, 'id' | 'createdAt' | 'updatedAt'>>) {
    const next = { ...this.props, ...input, updatedAt: new Date().toISOString() }
    Employee.assertIdentity(next.firstName, next.lastName, next.email)
    if (!next.departmentId) {
      throw new DomainError('Employee must be assigned to a department', 'EMPLOYEE_REQUIRES_DEPARTMENT')
    }
    if (next.managerId && next.managerId === next.id) {
      throw new DomainError('Employee cannot be their own manager', 'INVALID_MANAGER')
    }
    return new Employee(next)
  }

  toJSON(): EmployeeProps {
    return { ...this.props }
  }

  private static assertIdentity(firstName: string, lastName: string, email: string) {
    if (!firstName.trim() || !lastName.trim()) {
      throw new DomainError('Employee first and last name are required', 'INVALID_EMPLOYEE_NAME')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new DomainError('Employee email must be valid', 'INVALID_EMPLOYEE_EMAIL')
    }
  }
}
