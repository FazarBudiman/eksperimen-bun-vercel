import { Elysia } from 'elysia'
import { AuthCreateModels } from './auth.model'
import { AuthController } from './auth.controller'
import {cookie} from '@elysiajs/cookie'

const { COOKIE_SECRET } = process.env


export const auth = (app: Elysia) =>
    app.group('/auth', (app) =>
        app
            .use(cookie({
                httpOnly: true,
                signed: true,
                secret: COOKIE_SECRET!
            }))
            .post(
                '/sign-up',
                async ({ body }) => {
                    const res = await AuthController.addUserController(body)
                    return res
                },
                {
                    body: AuthCreateModels, 
                }
            )
            .post(
                '/sign-in',
                async ({ body }) => {
                    const res = await AuthController.signInController(body)
                    return res
                },
                {
                    body: AuthCreateModels, 
                }
            )
    )