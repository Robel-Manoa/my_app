import { z } from 'zod'

export const idParamSchema = z.object({ id: z.string().min(1) })

export const loginSchema = z.object({
  email: z.string().email(),
})

export const departmentCreateSchema = z.object({
  name: z.string().min(2),
  code: z.string().min(2).max(12),
  description: z.string().default(''),
})

export const departmentUpdateSchema = departmentCreateSchema.partial().extend({
  active: z.boolean().optional(),
})

export const employeeCreateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  jobTitle: z.string().min(2),
  departmentId: z.string().min(1),
  managerId: z.string().optional(),
  status: z.enum(['ACTIVE', 'ON_LEAVE', 'INACTIVE']).optional(),
  salaryBand: z.string().optional(),
})

export const employeeUpdateSchema = employeeCreateSchema.partial()

export const announcementCreateSchema = z.object({
  title: z.string().min(4),
  body: z.string().min(10),
  departmentId: z.string().optional(),
})

export const announcementUpdateSchema = announcementCreateSchema.partial()

export const feedbackCreateSchema = z.object({
  subject: z.string().min(4),
  message: z.string().min(10),
})

export const feedbackReviewSchema = z.object({
  reviewNote: z.string().min(5),
})

export const feedbackCloseSchema = z.object({
  closeNote: z.string().min(5),
})
