import { Department } from '../domain/entities/Department'

export interface DepartmentRepositoryPort {
  save(department: Department): Promise<void>
  findById(id: string): Promise<Department | null>
  listAll(): Promise<Department[]>
  deleteById(id: string): Promise<void>
}
