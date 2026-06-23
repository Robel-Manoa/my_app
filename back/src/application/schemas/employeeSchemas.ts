import { z } from 'zod'

export const createEmployeeSchema = z.object({
  userId: z.string().min(1),
  employeeNumber: z.string().min(3),
  departmentId: z.string().min(1),
  position: z.string().min(2),
  joinDate: z.string().transform((value) => new Date(value)),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).optional(),
  phone: z.string().optional(),
})

export const updateEmployeeSchema = createEmployeeSchema.partial()
