import { z } from 'zod'

export const loginSchema = z.object({
  token: z.string().min(1),
})

export const registerSchema = z.object({
  azureId: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(['EMPLOYEE', 'HR_ADMIN', 'DEPT_ADMIN']).default('EMPLOYEE'),
})
