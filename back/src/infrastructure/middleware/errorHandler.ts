import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors'
import { DomainError } from '../../domain/exceptions/DomainError'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof DomainError) {
    return res.status(err.status).json({ error: err.message, code: err.code })
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message, code: err.code, details: err.details })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal Server Error' })
}
