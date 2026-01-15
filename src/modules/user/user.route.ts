import bearer from '@elysiajs/bearer'
import { Elysia } from 'elysia'
import { requireAuth } from '../../guards/auth.guard'
import { assertAuth } from '../../utils/assertAuth'
import { UserCreateModel } from './user.model'
import { UserController } from './user.controller'

export const user = new Elysia().group('/users', (app) =>
  app
    .use(bearer())
    .post(
      '/',
      async ({ body, store, set }) => {
        const res = await UserController.addUserController(
          body,
          assertAuth(store)
        )
        set.status = 201
        return res
      },
      {
        body: UserCreateModel,
        beforeHandle: requireAuth(['SUPER_ADMIN']),
        detail: {
          tags: ['User'],
          summary: 'Create a New User',
        },
      }
    )

    .get(
      '/',
      async () => {
        const res = await UserController.getAllUserController()
        return res
      },
      {
        beforeHandle: requireAuth(['SUPER_ADMIN']),
        detail: {
          tags: ['User'],
          summary: 'Get All Users',
        },
      }
    )

    .delete(
      '/:userId',
      async ({ params }) => {
        const res = await UserController.deleteUserController(params.userId)
        return res
      },
      {
        beforeHandle: requireAuth(['SUPER_ADMIN']),
        detail: {
          tags: ['User'],
          summary: 'Delete User by Id',
        },
      }
    )
)
