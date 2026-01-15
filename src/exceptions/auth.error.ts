import { HttpError } from './Error'

export class UnauthorizedError extends HttpError {
  constructor(message = 'Authentication required') {
    super(401, false, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'You do not have permission to access this resource') {
    super(403, false, 'FORBIDDEN', message)
  }
}
