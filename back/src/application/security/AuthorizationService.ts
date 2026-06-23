import { Actor } from '../../domain/model/types'
import { ForbiddenError } from '../../domain/exceptions/DomainError'

export class AuthorizationService {
  requireHr(actor: Actor) {
    if (actor.role !== 'HR_ADMIN') {
      throw new ForbiddenError('Only HR admins can perform this action')
    }
  }

  requireHrOrDepartmentAdmin(actor: Actor) {
    if (!['HR_ADMIN', 'DEPARTMENT_ADMIN'].includes(actor.role)) {
      throw new ForbiddenError('Only HR or department admins can perform this action')
    }
  }

  canManageDepartment(actor: Actor, departmentId?: string) {
    if (actor.role === 'HR_ADMIN') return
    if (actor.role === 'DEPARTMENT_ADMIN' && departmentId && actor.departmentId === departmentId) return
    throw new ForbiddenError('Department admins can only manage records in their own department')
  }

  filterDepartmentRows<T extends { departmentId?: string }>(actor: Actor, rows: T[]) {
    if (actor.role === 'HR_ADMIN') return rows
    if (actor.role === 'DEPARTMENT_ADMIN') return rows.filter((row) => row.departmentId === actor.departmentId)
    return rows.filter((row) => row.departmentId === actor.departmentId)
  }

  stripSensitiveEmployeeFields<T extends { salaryBand?: string }>(actor: Actor, employee: T) {
    if (actor.role === 'HR_ADMIN') return employee
    const { salaryBand: _salaryBand, ...visible } = employee
    return visible
  }
}
