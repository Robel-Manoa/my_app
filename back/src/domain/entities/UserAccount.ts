import { DomainError } from '../exceptions/DomainError'
import { Role } from '../model/types'

export interface UserAccountProps {
  id: string
  email: string
  displayName: string
  role: Role
  departmentId?: string
  employeeId?: string
  active: boolean
}

export class UserAccount {
  private constructor(private readonly props: UserAccountProps) {}

  static create(props: UserAccountProps) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.email)) {
      throw new DomainError('User email must be valid', 'INVALID_USER_EMAIL')
    }
    if (props.role === 'DEPARTMENT_ADMIN' && !props.departmentId) {
      throw new DomainError('Department admins must belong to a department', 'DEPARTMENT_ADMIN_REQUIRES_DEPARTMENT')
    }
    if (props.role === 'EMPLOYEE' && !props.employeeId) {
      throw new DomainError('Employee users must be linked to an employee profile', 'EMPLOYEE_USER_REQUIRES_PROFILE')
    }
    return new UserAccount({ ...props, email: props.email.toLowerCase() })
  }

  toJSON(): UserAccountProps {
    return { ...this.props }
  }
}
