import { UserRepository } from '../../domain/ports/UserRepository'
import { User } from '../../domain/entities/User'
import { UserAlreadyExistsError } from '../../domain/exceptions/UserAlreadyExistsError'
import { InvalidInputError } from '../../domain/exceptions/InvalidInputError'
import bcrypt from 'bcryptjs'

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: {
    azureId?: string
    email: string
    firstName: string
    lastName: string
    password?: string
    role?: 'EMPLOYEE' | 'HR_ADMIN' | 'DEPT_ADMIN'
  }) {
    if (!input.email || !input.firstName || !input.lastName) {
      throw new InvalidInputError('Required fields are missing')
    }

    if (!input.email.includes('@')) {
      throw new InvalidInputError('Email is invalid')
    }

    const azureId = input.azureId || `azure-${Date.now()}`
    const existingAzureUser = await this.userRepository.findByAzureId?.(azureId)
    if (existingAzureUser) {
      throw new UserAlreadyExistsError()
    }

    const existingEmailUser = await this.userRepository.findByEmail?.(input.email)
    if (existingEmailUser) {
      throw new UserAlreadyExistsError()
    }

    const password = input.password ? await bcrypt.hash(input.password, 10) : undefined

    const user = new User({
      id: `user-${Date.now()}`,
      azureId,
      email: input.email,
      password: password || '',
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role ?? 'EMPLOYEE',
      isActive: true,
    })

    const savedUser = await this.userRepository.save(user)
    return {
      ...user.toJSON(),
      ...savedUser,
    }
  }
}
