import bearer from '@elysiajs/bearer'
import Elysia from 'elysia'
import { requireAuth } from '../../guards/auth.guard'
import { ArticleCoverUploadModel, ArticleModel } from './article.model'
import { ArticleController } from './article.controller'
import { assertAuth } from '../../utils/assertAuth'

export const article = new Elysia().group('/article', (app) =>
  app
    .use(bearer())
    .post(
      '/',
      async ({ body, store, set }) => {
        const res = await ArticleController.addArticleController(
          body,
          assertAuth(store)
        )
        set.status = 201
        return res
      },
      {
        beforeHandle: requireAuth('CREATE_ARTICLE'),
        body: ArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Create a New Article',
        },
      }
    )
    .post(
      '/upload',
      async ({ body }) => {
        const res = await ArticleController.uploadCoverArticleController(body)
        return res
      },
      {
        beforeHandle: requireAuth('CREATE_ARTICLE'),
        body: ArticleCoverUploadModel,
        detail: {
          tags: ['Article'],
          summary: 'Upload cover article',
        },
      }
    )
    .get('/', async () => {})
    .patch('/', async () => {})
)
