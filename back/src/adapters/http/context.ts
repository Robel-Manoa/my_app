import { NextFunction, Request, Response } from 'express'
import { ForbiddenError } from '../../domain/exceptions/DomainError'
import { Actor } from '../../domain/model/types'
import { UserRepository } from '../../ports/Repositories'

declare global {
  namespace Express {
    interface Request {
      actor?: Actor
    }
  }
}

export const actorMiddleware = (users: UserRepository) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (req.path === '/auth/login' || req.path === '/health') return next()
    const token = req.header('x-user-id') || req.header('authorization')?.replace(/^Bearer\s+/i, '')
    if (!token) throw new ForbiddenError('Missing mock Azure AD token')
    const user = await users.findById(token)
    if (!user || !user.active) throw new ForbiddenError('Invalid mock Azure AD token')
    req.actor = {
      id: user.id,
      email: user.email,
      role: user.role,
      ...(user.departmentId ? { departmentId: user.departmentId } : {}),
      ...(user.employeeId ? { employeeId: user.employeeId } : {}),
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const requireActor = (req: Request): Actor => {
  if (!req.actor) throw new ForbiddenError('Authentication required')
  return req.actor
}
