export interface UserProps {
  id: string
  azureId?: string
  email: string
  password: string,
  firstName: string
  lastName: string
  role: 'EMPLOYEE' | 'HR_ADMIN' | 'DEPT_ADMIN'
  isActive: boolean
}

export class User {
  constructor(private props: UserProps) {}

  get id() {
    return this.props.id
  }

  get azureId() {
    return this.props.azureId
  }

  get email() {
    return this.props.email
  }

  get firstName() {
    return this.props.firstName
  }

  get lastName() {
    return this.props.lastName
  }

  get role() {
    return this.props.role
  }

  get isActive() {
    return this.props.isActive
  }

  toJSON() {
    return { ...this.props }
  }
}
