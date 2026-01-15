import { Elysia } from 'elysia'
import { requireAuth } from '../../guards/auth.guard'
import { bearer } from '@elysiajs/bearer'
import { MentorCreateModel, MentorUploadModel } from './mentor.model'
import { MentorController } from './mentor.controller'
import { assertAuth } from '../../utils/assertAuth'

export const mentor = new Elysia().group('/mentors', (app) =>
  app
    .use(bearer())
    .post(
      '/upload',
      async ({ body }) => {
        const res = await MentorController.uploadProfileController(body.profile)
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
        body: MentorUploadModel,
        detail: {
          tags: ['Mentor'],
          summary: 'Upload Profile Picture Mentor',
        },
      }
    )

    .post(
      '/',
      async ({ body, store, set }) => {
        const res = await MentorController.addMentorController(
          body,
          assertAuth(store)
        )
        set.status = 201
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
        body: MentorCreateModel,
        detail: {
          tags: ['Mentor'],
          summary: 'Create a New Mentor',
        },
      }
    )

    .get(
      '/',
      async () => {
        const res = await MentorController.getAllMentorController()
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
        detail: {
          tags: ['Mentor'],
          summary: 'Get All Mentors',
        },
      }
    )

    .put(
      '/:mentorId',
      async ({ body, store, params }) => {
        const res = await MentorController.updateMentorController(
          params.mentorId,
          body,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
        body: MentorCreateModel,
        detail: {
          tags: ['Mentor'],
          summary: 'Update Mentor by Id',
        },
      }
    )

    .delete(
      '/:mentorId',
      async ({ params }) => {
        const res = await MentorController.deleteMentorController(
          params.mentorId
        )
        return res
      },
      {
        beforeHandle: requireAuth(['ADMIN', 'SUPER_ADMIN']),
        detail: {
          tags: ['Mentor'],
          summary: 'Delete Mentor by Id',
        },
      }
    )
)
