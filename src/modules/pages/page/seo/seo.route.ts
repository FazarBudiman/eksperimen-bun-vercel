import bearer from '@elysiajs/bearer'
import Elysia, { t } from 'elysia'
import { SeoController } from './seo.controller'
import { requireAuth } from '../../../../guards/auth.guard'
import { ParamsSeoModel, SeoModel } from './seo.model'
import { assertAuth } from '../../../../utils/assertAuth'
import { ParamsPageModel } from '../page.model'

export const seo = new Elysia({ prefix: '/:pageId/seo' })
  .use(bearer())
  .post(
    '/',
    async ({ body, params, store, set }) => {
      const res = await SeoController.addSeoController(
        body,
        params,
        assertAuth(store)
      )
      set.status = 201
      return res
    },
    {
      beforeHandle: requireAuth('CREATE_SEO'),
      body: SeoModel,
      params: ParamsPageModel,
      detail: {
        tags: ['Pages'],
        summary: '[SEO] Create a New SEO in Page',
      },
    }
  )
  .get(
    '/',
    async ({ params }) => {
      const res = await SeoController.getSeoByPageIdController(params)
      return res
    },
    {
      beforeHandle: requireAuth('READ_SEO'),
      params: ParamsPageModel,
      detail: {
        tags: ['Pages'],
        summary: '[SEO] Get SEO by page id',
      },
    }
  )
  .get(
    '/:seoId',
    async ({ params }) => {
      const res = await SeoController.getSeoByIdController(params)
      return res
    },
    {
      beforeHandle: requireAuth('READ_SEO'),
      params: ParamsSeoModel,
      detail: {
        tags: ['Pages'],
        summary: '[SEO] Get SEO by id',
      },
    }
  )
  .patch(
    '/:seoId',
    async ({ body, params, store }) => {
      const res = await SeoController.updateSeoController(
        body,
        params,
        assertAuth(store)
      )
      return res
    },
    {
      beforeHandle: requireAuth('UPDATE_SEO'),
      body: t.Partial(SeoModel),
      params: ParamsSeoModel,
      detail: {
        tags: ['Pages'],
        summary: '[SEO] Update SEO by id',
      },
    }
  )

  .put(
    '\:seoId',
    async ({ params, store }) => {
      const res = await SeoController.changeStatusSeoController(
        params,
        assertAuth(store)
      )
      return res
    },
    {
      beforeHandle: requireAuth('UPDATE_SEO'),
      params: ParamsSeoModel,
      detail: {
        tags: ['Pages'],
        summary: '[SEO] Update SEO status (active or not active) by Id',
      },
    }
  )

  .delete(
    '/:seoId',
    async ({ params }) => {
      const res = await SeoController.deleteSeoController(params)
      return res
    },
    {
      beforeHandle: requireAuth('DELETE_SEO'),
      params: ParamsSeoModel,
      detail: {
        tags: ['Pages'],
        summary: '[SEO] Delete SEO by Id',
      },
    }
  )
