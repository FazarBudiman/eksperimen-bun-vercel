import { Elysia } from 'elysia'
import { AuthController } from './auth.controller'
import { RefreshTokenModel, SignInModel } from './auth.model'
import { jwtPlugin } from '../../plugins/jwt/jwt.plugin'
import { assertAuth } from '../../utils/assertAuth'
import bearer from '@elysiajs/bearer'
import { requireAuth } from '../../guards/auth.guard'

export const auth = (app: Elysia) =>
  app.group('/auth', (app) =>
    app
      .use(jwtPlugin)
      .post(
        '/sign-in',
        async ({ body, accessToken, refreshToken }) => {
          const res = await AuthController.signInController(
            body,
            accessToken,
            refreshToken
          )
          return res
        },
        {
          body: SignInModel,
          detail: {
            tags: ['Auth'],
            summary: 'Sign In',
          },
        }
      )

      .put(
        '/refresh',
        async ({ body, accessToken, refreshToken }) => {
          const res = AuthController.refreshController(
            body,
            accessToken,
            refreshToken
          )
          return res
        },
        {
          body: RefreshTokenModel,
          detail: {
            tags: ['Auth'],
            summary: 'Refresh Access Token',
          },
        }
      )
      .delete(
        '/sign-out',
        async ({ body }) => {
          const res = await AuthController.signOutController(body)
          return res
        },
        {
          body: RefreshTokenModel,
          detail: {
            tags: ['Auth'],
            summary: 'Sign Out',
          },
        }
      )

      .use(bearer())
      .get(
        '/me',
        async ({ store }) => {
          const res = await AuthController.getUserAuthenticatedController(
            assertAuth(store)
          )
          return res
        },
        {
          beforeHandle: requireAuth('CHECK_AUTHENTICATED'),
          detail: {
            tags: ['Auth'],
            summary: 'Get User Authenticated',
          },
        }
      )
  )
