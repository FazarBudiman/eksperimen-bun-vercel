import { Elysia } from 'elysia'
import { AuthController } from './auth.controller'
import { jwtPlugin } from '../../plugins/jwt.plugin'
import { RefreshTokenModel, SignInModel } from './auth.model'

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
        }
      )
  )
