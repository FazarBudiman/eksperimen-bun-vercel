import { Static, t } from 'elysia'

export const contentBlocksModel = t.Object({
  id: t.Optional(t.String()),
  type: t.String(),
  data: t.Record(t.String(), t.Any()),
})

// Model Create Article
export const ArticleModel = t.Object({
  contentBlocks: t.Array(contentBlocksModel, {
    minItems: 1,
    error: 'Artikel harus memiliki 1 block',
  }),
})
export type ArticleProps = Static<typeof ArticleModel>

// Model Update Article
export const ArticleStatus = {
  DRAFT: 'DRAFT',
  REVIEW: 'REVIEW',
  PUBLISHED: 'PUBLISHED',
  UNPUBLISHED: 'UNPUBLISHED',
} as const

export const ArticleUpdateModel = t.Object({
  title: t.String({
    minLength: 10,
    error: 'Judul harus merupakan string dan memiliki minimal 10 karakter',
  }),
  contentBlocks: t.Optional(t.Array(t.Any())),
  status: t.Optional(
    t.Enum(ArticleStatus, {
      error:
        'Status tidak valid. Pilih antara DRAFT, REVIEW, PUBLISHED atau UNPUBLISHED',
    })
  ),
})
export type ArticleUpdateProps = Static<typeof ArticleUpdateModel>

// Model Add Cover Article
export const ArticleCoverModel = t.Object({
  cover_image: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m',
    error: 'Poster harus berupa JPG, PNG, atau WEBP dengan ukuran maksimal 5MB',
  }),
  cover_description: t.String({
    minLength: 20,
    error: 'Judul harus merupakan string dan memiliki minimal 20 karakter',
  }),
})
export type ArticleCoverProps = Static<typeof ArticleCoverModel>

// Model Params Article
export const ParamsArticleModel = t.Object({
  articleId: t.String({
    format: 'uuid',
    error: 'Format article id tidak valid',
  }),
})
export type ParamsArticleProps = Static<typeof ParamsArticleModel>

export type UpdateArticleServiceProps = {
  title?: string
  coverUrl?: string
  contentText?: string
  contentBlocks?: any[]
  status?: string
}

// Model Query Status Artivle
export const QueryArticleStatusModel = t.Object({
  status: t.Optional(
    t.Enum(ArticleStatus, {
      error:
        'Status tidak valid. Pilih antara DRAFT, REVIEW, PUBLISHED atau UNPUBLISHED',
    })
  ),
})
export type QueryArticleStatusProps = Static<typeof QueryArticleStatusModel>
