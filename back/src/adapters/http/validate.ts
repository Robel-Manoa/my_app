import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

export const validateBody = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) return validationError(next, parsed.error.flatten().fieldErrors)
  req.body = parsed.data
  return next()
}

export const validateParams = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.params)
  if (!parsed.success) return validationError(next, parsed.error.flatten().fieldErrors)
  req.params = parsed.data as typeof req.params
  return next()
}

const validationError = (next: NextFunction, details: unknown) => {
  const error = new Error('Request validation failed') as Error & { status?: number; code?: string; details?: unknown }
  error.status = 400
  error.code = 'VALIDATION_ERROR'
  error.details = details
  return next(error)
}
