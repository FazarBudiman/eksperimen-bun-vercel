import { Elysia } from 'elysia'
import { message } from './modules/message/message.route'
import { auth } from './modules/auth/auth.route'
import { HttpError } from './exceptions/Error'
import { user } from './modules/user/user.route'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { mentor } from './modules/mentor/mentor.route'
import { mitra } from './modules/mitra/mitra.route'
import { testimoni } from './modules/testimoni/testimoni.route'

const App = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Dokumentasi API CMS Arutala',
          version: '1.0.0',
        },
        tags: [
          { name: 'Auth', description: 'Authentication Endpoint' },
          { name: 'User', description: 'User Endpoint' },
          { name: 'Message', description: 'Message Endpoint' },
          { name: 'Mentor', description: 'Mentor Endpoint' },
          { name: 'Mitra', description: 'Mitra Endpoint' },
          { name: 'Testimoni', description: 'Testimoni Endpoint' },
        ],
      },
    })
  )

  // Global Mapping Error
  .onError(({ error, code, set }) => {
    if (error instanceof HttpError) {
      set.status = error.status
      return {
        success: false,
        statusCode: `${error.status} ${error.code}`,
        message: error.message,
      }
    }

    if (code === 'VALIDATION') {
      const errors =
        error.all?.map((err: any) => ({
          field: err.path?.replace('/', '') || 'unknown',
          message: err.schema.error || err.message,
        })) || []

      return {
        success: false,
        statusCode: `${error.status} ${error.code}`,
        message: 'Invalid request data',
        details: errors,
      }
    }

    if (code === 'NOT_FOUND') {
      set.status = 404
      return {
        success: false,
        statusCode: `${error.status} ${error.code}`,
        message: 'Route Not Found',
      }
    }
    console.log(error)

    set.status = 500
    return {
      success: false,
      statusCode: '500 INTERNAL_SERVER_ERROR',
      message: error.message,
    }
  })

  // Route Endpoint
  .get('/', () => 'The King is Back')
  .use(auth)
  .use(user)
  .use(message)
  .use(mentor)
  .use(mitra)
  .use(testimoni)

export default App
