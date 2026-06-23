import { DomainError } from '../exceptions/DomainError'

export interface DepartmentProps {
  id: string
  name: string
  code: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export class Department {
  private constructor(private readonly props: DepartmentProps) {}

  static create(input: Omit<DepartmentProps, 'createdAt' | 'updatedAt' | 'active'> & { active?: boolean }) {
    Department.assertName(input.name)
    Department.assertCode(input.code)
    const now = new Date().toISOString()
    return new Department({
      ...input,
      name: input.name.trim(),
      code: input.code.trim().toUpperCase(),
      description: input.description.trim(),
      active: input.active ?? true,
      createdAt: now,
      updatedAt: now,
    })
  }

  static rehydrate(props: DepartmentProps) {
    return new Department(props)
  }

  update(input: Partial<Pick<DepartmentProps, 'name' | 'code' | 'description' | 'active'>>) {
    const next = { ...this.props, ...input, updatedAt: new Date().toISOString() }
    Department.assertName(next.name)
    Department.assertCode(next.code)
    return new Department({
      ...next,
      name: next.name.trim(),
      code: next.code.trim().toUpperCase(),
      description: next.description.trim(),
    })
  }

  deactivate() {
    return this.update({ active: false })
  }

  toJSON(): DepartmentProps {
    return { ...this.props }
  }

  private static assertName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new DomainError('Department name must contain at least 2 characters', 'INVALID_DEPARTMENT_NAME')
    }
  }

  private static assertCode(code: string) {
    if (!/^[A-Z0-9-]{2,12}$/i.test(code.trim())) {
      throw new DomainError('Department code must be 2-12 letters, numbers, or hyphens', 'INVALID_DEPARTMENT_CODE')
    }
  }
}
