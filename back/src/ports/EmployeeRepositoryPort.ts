import { Employee } from '../domain/entities/Employee'

export interface EmployeeRepositoryPort {
  save(employee: Employee): Promise<void>
  findById(id: string): Promise<Employee | null>
  listAll(): Promise<Employee[]>
  deleteById(id: string): Promise<void>
}
