import { z } from 'zod'

export const createDepartmentSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2),
  description: z.string().optional(),
  headOfDepartmentId: z.string().optional(),
})

export const updateDepartmentSchema = createDepartmentSchema.partial()
