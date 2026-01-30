import { Static, t } from 'elysia'

// Model Course Benefit
export const CourseBenefitModel = t.Array(
  t.Object({
    courseBenefitId: t.String({
      format: 'uuid',
      error: 'Format uuid tidak valid',
    }),
    orderNum: t.Integer({
      error: 'order num harus integer',
    }),
  })
)

export type CourseBenefitProps = Static<typeof CourseBenefitModel>
