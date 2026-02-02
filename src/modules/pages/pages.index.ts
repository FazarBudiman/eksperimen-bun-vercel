import Elysia from 'elysia'
import { page } from './page/page.route'
import { seo } from './page/seo/seo.route'

export const pages = new Elysia({ prefix: '/pages' }).use(page).use(seo)
