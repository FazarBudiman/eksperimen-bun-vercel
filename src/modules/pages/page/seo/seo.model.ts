import { Static, t } from 'elysia'

// Model Request Body SEO
export const SeoModel = t.Object({
  metaTitle: t.String({
    minLength: 3,
    maxLength: 250,
    error: 'Meta title seo merupakan string dan karakter antara 3 - 250',
  }),
  metaDescription: t.String({
    minLength: 15,
    error: 'Meta Description merupakan string dengan minimal karakter 15',
  }),
})
export type SeoProps = Static<typeof SeoModel>

// Model Params SEO
export const ParamsSeoModel = t.Object({
  pageId: t.String({
    format: 'uuid',
    error: 'Format page id tidak valid',
  }),
  seoId: t.String({
    format: 'uuid',
    error: 'Format seo id tidak valid',
  }),
})
export type ParamsSeoProps = Static<typeof ParamsSeoModel>
