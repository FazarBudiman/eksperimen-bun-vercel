import { Static, t } from 'elysia'

export const ArticleModel = t.Object({
  //   title: t.String({
  //     minLength: 10,
  //     error: 'Judul harus merupakan string dan memiliki minimal 10 karakter',
  //   }),
  //   coverUrl: t.Optional(
  //     t.String({
  //       format: 'uri',
  //       error: 'Cover harus berupa URL valid',
  //     })
  //   ),
  contentBlocks: t.Array(
    t.Object({
      id: t.Optional(t.String()),
      type: t.String(),
      data: t.Record(t.String(), t.Any()),
    }),
    {
      minItems: 1,
      error: 'Artikel harus memiliki 1 block',
    }
  ),
})
export type ArticleProps = Static<typeof ArticleModel>

// Model Upload Poster Batch
export const ArticleCoverUploadModel = t.Object({
  cover: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m',
    error: 'Poster harus berupa JPG, PNG, atau WEBP dengan ukuran maksimal 5MB',
  }),
})
export type ArticleCoverUploadProps = Static<typeof ArticleCoverUploadModel>
