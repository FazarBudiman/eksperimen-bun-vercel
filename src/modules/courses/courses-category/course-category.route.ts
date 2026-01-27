import bearer from '@elysiajs/bearer'
import Elysia from 'elysia'
import { CourseCategoryController } from './course-category.controller'

export const courseCategory = new Elysia({ prefix: '/courses-category' })
  .use(bearer())
  .get(
    '/',
    async () => {
      const res =
        await CourseCategoryController.getAllCourseCategoryController()
      return res
    },
    {
      detail: {
        tags: ['Courses'],
        summary: 'Get Course Category by Course Id',
      },
    }
  )
