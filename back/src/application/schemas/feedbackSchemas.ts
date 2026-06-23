import { z } from 'zod'

export const submitFeedbackSchema = z.object({
  message: z.string().min(5),
  targetAnnouncementId: z.string().optional(),
})

export const reviewFeedbackSchema = z.object({
  status: z.enum(['SUBMITTED', 'REVIEWED', 'RESOLVED']),
})
