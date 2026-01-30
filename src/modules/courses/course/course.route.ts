import { bearer } from '@elysiajs/bearer'
import { Elysia, t } from 'elysia'
import { assertAuth } from '../../../utils/assertAuth'
import { requireAuth } from '../../../guards/auth.guard'
import { CourseController } from './course.controller'
import {
  CourseModel,
  ParamsCourseModel,
  QueryCourseModel,
} from './course.model'

export const course = new Elysia()
  .use(bearer())
  .post(
    '/',
    async ({ body, set, store }) => {
      const res = await CourseController.addCourseController(
        body,
        assertAuth(store)
      )
      set.status = 201
      return res
    },
    {
      beforeHandle: requireAuth('CREATE_COURSE'),
      body: CourseModel,
      detail: {
        tags: ['Courses'],
        summary: '[course] Create a New Course',
      },
    }
  )
  .get(
    '/',
    async ({ query }) => {
      const res = await CourseController.getAllCourseController(query)
      return res
    },
    {
      query: QueryCourseModel,
      detail: {
        tags: ['Courses'],
        summary: '[course] Get All Course with Query Parameter (optional)',
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
        summary: '[course] Get Upcoming Course (1 category 1 course)',
      },
    }
  )
  .get(
    '/:courseId',
    async ({ params }) => {
      const res = await CourseController.getCourseByIdController(params)
      return res
    },
    {
      beforeHandle: requireAuth('READ_COURSE'),
      params: ParamsCourseModel,
      detail: {
        tags: ['Courses'],
        summary: '[course] Get course By Id',
      },
    }
  )

  .patch(
    '/:courseId',
    async ({ params, body, store }) => {
      const res = await CourseController.updateCourseController(
        body,
        params,
        assertAuth(store)
      )
      return res
    },
    {
      beforeHandle: requireAuth('UPDATE_COURSE'),
      params: ParamsCourseModel,
      body: t.Partial(CourseModel),
      detail: {
        tags: ['Courses'],
        summary: '[course] Update Course by Id',
      },
    }
  )

  .delete(
    '/:courseId',
    async ({ params }) => {
      const res = await CourseController.deleteCourseController(params)
      return res
    },
    {
      beforeHandle: requireAuth('DELETE_COURSE'),
      params: ParamsCourseModel,
      detail: {
        tags: ['Courses'],
        summary: '[course] Delete Course by Id',
      },
    }
  )
