import bearer from '@elysiajs/bearer'
import Elysia, { t } from 'elysia'
import { requireAuth } from '../../guards/auth.guard'
import {
  ArticleCoverModel,
  ArticleModel,
  ArticleUpdateModel,
  ParamsArticleModel,
  QueryArticleStatusModel,
} from './article.model'
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
    .get(
      '/',
      async ({ query }) => {
        const res = await ArticleController.getAllArticleController(query)
        return res
      },
      {
        query: QueryArticleStatusModel,
        detail: {
          tags: ['Article'],
          summary: 'Get All Article',
        },
      }
    )

    .get(
      '/:articleId',
      async ({ params }) => {
        const res = await ArticleController.getArticleByIdController(params)
        return res
      },
      {
        params: ParamsArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Get Article by Id',
        },
      }
    )
    .patch(
      '/:articleId',
      async ({ body, params, store }) => {
        const res = await ArticleController.updateArticleController(
          body,
          params,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth('UPDATE_ARTICLE'),
        body: ArticleUpdateModel,
        params: ParamsArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Update Article by Id',
        },
      }
    )

    .delete(
      '/:articleId',
      async ({ params }) => {
        const res = await ArticleController.deleteArticleController(params)
        return res
      },
      {
        beforeHandle: requireAuth('DELETE_ARTICLE'),
        params: ParamsArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Delete Article by Id',
        },
      }
    )

    .post(
      '/:articleId/cover',
      async ({ body, params }) => {
        const res = await ArticleController.addCoverArticleController(
          body,
          params
        )
        return res
      },
      {
        beforeHandle: requireAuth('CREATE_ARTICLE'),
        body: ArticleCoverModel,
        params: ParamsArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Add cover for article',
        },
      }
    )

    .patch(
      '/:articleId/cover',
      async ({ body, params, store }) => {
        const res = await ArticleController.updateCoverArticleController(
          body,
          params,
          assertAuth(store)
        )
        return res
      },
      {
        beforeHandle: requireAuth('UPDATE_ARTICLE'),
        body: t.Partial(ArticleCoverModel),
        params: ParamsArticleModel,
        detail: {
          tags: ['Article'],
          summary: 'Add cover for article',
        },
      }
    )
)
