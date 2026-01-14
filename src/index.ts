import { Elysia } from 'elysia'
import { message } from './modules/messages/message.route'
import { auth } from './modules/auth/auth.route'
import { HttpError } from './exceptions/Error'

const App = new Elysia()
  .onError(({ error, code, set }) => {
    if (error instanceof HttpError) {
      set.status = error.status
      return {
        status: 'fail',
        code: error.code,
        message: error.message,
        fields: error.fields,
      }
    }

    if (code === 'VALIDATION') {
      const errors =
        error.all?.map((err: any) => ({
          field: err.path?.replace('/', '') || 'unknown',
          message: err.schema.error || err.message,
        })) || []

      return {
        status: 'fail',
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        fields: errors,
      }
    }

    if (code === 'NOT_FOUND') {
      set.status = 404
      return {
        status: 'fail',
        code: 'NOT_FOUND',
        message: 'Route Not Found',
      }
    }

    set.status = 500
    return {
      status: 'fail',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected error',
    }
  })

  .get('/', () => 'The King is Back')
  .use(auth)
  .use(message)

export default App
