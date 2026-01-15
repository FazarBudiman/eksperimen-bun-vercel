import { HttpError } from './Error'

export class ResourceNotFoundError extends HttpError {
  constructor(message = 'Resource not found') {
    super(404, false, 'RESOURCE_NOT_FOUND', message)
  }
}

export class BadRequest extends HttpError {
  constructor(message = 'Bad request') {
    super(400, false, 'BAD_REQUEST', message)
  }
}
