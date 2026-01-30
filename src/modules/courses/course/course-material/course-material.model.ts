import { Static, t } from 'elysia'

// Model Course Material
export const CourseMaterialModel = t.Array(
  t.Object({
    title: t.String({
      minLength: 5,
      maxLength: 255,
      error: 'Judul course minimal 5 dan maksimal 255 karakter',
    }),
    description: t.String({
      minLength: 50,
      maxLength: 1000,
      error: 'Deskripsi course minimal 50 dan maksimal 1000 karakter',
    }),
    orderNum: t.Integer({
      error: 'order num harus integer',
    }),
  })
)
export type CourseMaterialProps = Static<typeof CourseMaterialModel>
