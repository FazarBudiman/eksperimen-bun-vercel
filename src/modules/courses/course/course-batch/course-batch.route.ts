import bearer from '@elysiajs/bearer'
import Elysia, { t } from 'elysia'
import { assertAuth } from '../../../../utils/assertAuth'
import {
  CourseBatchModel,
  CourseBatchPosterUploadModel,
  ParamsCourseBatchModel,
} from './course-batch.model'
import { CourseBatchController } from './course-batch.controller'
import { requireAuth } from '../../../../guards/auth.guard'
import { ParamsCourseModel } from '../course.model'

export const courseBatch = new Elysia({ prefix: '/:courseId/batch' })
  .use(bearer())
  .post(
    '/',
    async ({ body, store, set, params }) => {
      const res = await CourseBatchController.addCourseBatchController(
        body,
        params,
        assertAuth(store)
      )

      set.status = 201
      return res
    },
    {
      beforeHandle: requireAuth('CREATE_COURSE'),
      body: CourseBatchModel,
      params: ParamsCourseModel,
      detail: {
        tags: ['Courses'],
        summary: '[course-batch] Create a New Batch for Course',
      },
    }
  )
  .post(
    '/:batchId/upload',
    async ({ body, params, store }) => {
      const res = await CourseBatchController.uploadCourseBatchPosterController(
        body,
        params,
        assertAuth(store)
      )
      return res
    },
    {
      beforeHandle: requireAuth('CREATE_COURSE'),
      body: CourseBatchPosterUploadModel,
      params: ParamsCourseBatchModel,
      detail: {
        tags: ['Courses'],
        summary: '[course-batch] Upload Poster for Batch of Course',
      },
    }
  )

  .patch(
    '/:batchId',
    async ({ body, params, store }) => {
      const res = await CourseBatchController.updateCourseBatchController(
        body,
        params,
        assertAuth(store)
      )
      return res
    },
    {
      beforeHandle: requireAuth('UPDATE_COURSE'),
      body: t.Partial(CourseBatchModel),
      params: ParamsCourseBatchModel,
      detail: {
        tags: ['Courses'],
        summary: '[course-batch] Update Batch in Course by Batch Id',
      },
    }
  )

  .delete(
    '/:batchId',
    async ({ params }) => {
      const res =
        await CourseBatchController.deleteCourseBatchController(params)
      return res
    },
    {
      beforeHandle: requireAuth('DELETE_COURSE'),
      params: ParamsCourseBatchModel,
      detail: {
        tags: ['Courses'],
        summary: '[course-batch] Delete Batch in Course by Batch Id',
      },
    }
  )
