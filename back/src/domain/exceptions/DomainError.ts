export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code = 'DOMAIN_ERROR',
    public readonly status = 400
  ) {
    super(message)
    this.name = 'DomainError'
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} was not found`, 'NOT_FOUND', 404)
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = 'You are not allowed to perform this action') {
    super(message, 'FORBIDDEN', 403)
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
  }
}
