import { Static, t } from 'elysia'

// Model Request Body Pages
export const PageModel = t.Object({
  parentPage: t.Optional(
    t.String({
      error: 'Title parent page harus merupakan string',
    })
  ),
  pageTitle: t.String({
    error: 'Judul halaman harus merupakan string',
  }),
})
export type PageProps = Static<typeof PageModel>

// Params Page
export const ParamsPageModel = t.Object({
  pageId: t.String({
    format: 'uuid',
    error: 'Format page id tidak valid',
  }),
})
export type ParamsPageProps = Static<typeof ParamsPageModel>
