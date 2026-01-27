import { bearer } from '@elysiajs/bearer'
import { Elysia } from 'elysia'
// import { assertAuth } from '../../../utils/assertAuth'
// import { requireAuth } from '../../../guards/auth.guard'
// import { CourseCreateModel } from './course.model'
import { CourseController } from './course.controller'
import { QueryParamsCourseModel } from './course.model'

export const course = new Elysia()
  .use(bearer())
  // .post(
  //   '/',
  //   async ({ body, set, store }) => {
  //     const res = await CourseController.addCourseController(
  //       body,
  //       assertAuth(store)
  //     )
  //     set.status = 201
  //     return res
  //   },
  //   {
  //     beforeHandle: requireAuth('CREATE_COURSE'),
  //     body: CourseCreateModel,
  //   }
  // )
  .get(
    '/',
    async ({ query }) => {
      const res = await CourseController.getAllCourseController(query)
      return res
    },
    {
      query: QueryParamsCourseModel,
      detail: {
        tags: ['Courses'],
        summary: 'Get All Course with Query Parameter (optional)',
      },
    }
  )
  .get(
    '/upcoming-course',
    async () => {
      const res = await CourseController.getUpcomingCourseController()
      return res
    },
    {
      detail: {
        tags: ['Courses'],
        summary: 'Get Upcoming Course (1 category 1 course)',
      },
    }
  )
  .get(
    '/:courseId',
    async ({ params }) => {
      const res = await CourseController.getCourseByIdController(
        params.courseId
      )
      return res
    },
    {
      detail: {
        tags: ['Courses'],
        summary: 'Get course By Id',
      },
    }
  )
