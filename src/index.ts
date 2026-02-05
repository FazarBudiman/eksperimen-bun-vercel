import { Elysia } from 'elysia'
import { message } from './modules/message/message.route'
import { auth } from './modules/auth/auth.route'
import { HttpError } from './exceptions/Error'
import { user } from './modules/user/user.route'
import { swagger } from '@elysiajs/swagger'
import { cors } from '@elysiajs/cors'
import { mitra } from './modules/mitra/mitra.route'
import { testimoni } from './modules/testimoni/testimoni.route'
import { courses } from './modules/courses/courses.index'
import { contributor } from './modules/contributor/contributor.route'
import { pages } from './modules/pages/pages.index'
import { article } from './modules/article/article.route'
import { analytics } from './modules/analytics/analytics.route'

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
          { name: 'Contributor', description: 'Contributor Endpoint' },
          { name: 'Mitra', description: 'Mitra Endpoint' },
          { name: 'Testimoni', description: 'Testimoni Endpoint' },
          { name: 'Courses', description: 'Courses Endpoint' },
          { name: 'Pages', description: 'Pages Endpoint' },
          { name: 'Article', description: 'Article Endpoint' },
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
  .get('/', () => 'Welcome To Arutala CMS API')
  .use(auth)
  .use(user)
  .use(message)
  .use(contributor)
  .use(mitra)
  .use(testimoni)
  .use(courses)
  .use(pages)
  .use(article)
  .use(analytics)

export default App
