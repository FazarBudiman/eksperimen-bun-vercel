import bearer from '@elysiajs/bearer'
import Elysia from 'elysia'
import { PageController } from './page.controller'
import { assertAuth } from '../../../utils/assertAuth'
import { requireAuth } from '../../../guards/auth.guard'
import { PageModel, ParamsPageModel } from './page.model'

export const page = new Elysia()
  .use(bearer())
  .post(
    '/',
    async ({ body, store, set }) => {
      const res = await PageController.addPageController(
        body,
        assertAuth(store)
      )
      set.status = 201
      return res
    },
    {
      beforeHandle: requireAuth('CREATE_PAGE'),
      body: PageModel,
      detail: {
        tags: ['Pages'],
        summary: 'Create a New Pages',
      },
    }
  )
  .get(
    '/',
    async () => {
      const res = await PageController.getAllController()
      return res
    },
    {
      beforeHandle: requireAuth('READ_PAGE'),
      detail: {
        tags: ['Pages'],
        summary: 'Get All Pages',
      },
    }
  )

  .get(
    '/:pageId',
    async ({ params }) => {
      const res = await PageController.getPageByIdController(params)
      return res
    },
    {
      beforeHandle: requireAuth('READ_PAGE'),
      params: ParamsPageModel,
      detail: {
        tags: ['Pages'],
        summary: 'Get Page by Id',
      },
    }
  )

  .put(
    '/:pageId',
    async ({ body, params, store }) => {
      const res = await PageController.updatePageController(
        body,
        params,
        assertAuth(store)
      )
      return res
    },
    {
      beforeHandle: requireAuth('UPDATE_PAGE'),
      body: PageModel,
      params: ParamsPageModel,
      detail: {
        tags: ['Pages'],
        summary: 'Update Page by Id',
      },
    }
  )

  .delete(
    '/:pageId',
    async ({ params }) => {
      const res = await PageController.deletePageController(params)
      return res
    },
    {
      beforeHandle: requireAuth('DELETE_PAGE'),
      params: ParamsPageModel,
      detail: {
        tags: ['Pages'],
        summary: 'Delete Page by Id',
      },
    }
  )
