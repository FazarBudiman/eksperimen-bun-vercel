import { Static, t } from 'elysia'

export const BatchStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  OPEN: 'OPEN',
  ON_GOING: 'ON_GOING',
  COMPLETED: 'COMPLETED',
} as const

// Model Course Session in Batch
export const CourseSessionModel = t.Array(
  t.Object({
    topic: t.String({
      minLength: 5,
      maxLength: 255,
      error: 'Topik session minimal 5 dan maksimal 255 karakter',
    }),

    sessionDate: t.String({
      format: 'date',
      error: 'Format sessionDate harus date (YYYY-MM-DD)',
    }),

    sessionStartTime: t.String({
      pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
      error: 'Format sessionStartTime harus HH:mm (00:00 - 23:59)',
    }),

    sessionEndTime: t.String({
      pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
      error: 'Format sessionEndTime harus HH:mm (00:00 - 23:59)',
    }),
  })
)
export type CourseSessionProps = Static<typeof CourseSessionModel>

export const CoursePriceModel = t.Object({
  basePrice: t.Number({
    error: 'Base price harus berupa angka',
  }),

  discountType: t.Optional(t.Union([t.Literal('PERCENT'), t.Literal('FIXED')])),

  discountValue: t.Optional(
    t.Number({
      error: 'Discount value harus berupa angka',
    })
  ),

  finalPrice: t.Optional(
    t.Number({
      error: 'Final price harus berupa angka',
    })
  ),
})
export type CoursePriceProps = Static<typeof CoursePriceModel>

// Model Create Course Batch
export const CourseBatchModel = t.Object({
  batchName: t.String({
    minLength: 5,
    maxLength: 255,
    error: 'Nama batch minimal 5 dan maksimal 255 karakter',
  }),

  contributorId: t.String({
    format: 'uuid',
    error: 'Format contributorId harus UUID',
  }),

  registrationStart: t.String({
    format: 'date',
    error: 'Format registrationStart harus date (YYYY-MM-DD)',
  }),

  registrationEnd: t.String({
    format: 'date',
    error: 'Format registrationEnd harus date (YYYY-MM-DD)',
  }),

  startDate: t.String({
    format: 'date',
    error: 'Format startDate harus date (YYYY-MM-DD)',
  }),

  endDate: t.String({
    format: 'date',
    error: 'Format endDate harus date (YYYY-MM-DD)',
  }),

  batchStatus: t.Enum(BatchStatus, {
    error: 'Batch status tidak valid',
  }),

  batchSession: CourseSessionModel,
  batchPrice: CoursePriceModel,
})
export type CourseBatchProps = Static<typeof CourseBatchModel>

// Model Upload Poster Batch
export const CourseBatchPosterUploadModel = t.Object({
  poster: t.File({
    type: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: '5m',
    error: 'Poster harus berupa JPG, PNG, atau WEBP dengan ukuran maksimal 5MB',
  }),
})
export type CourseBatchPosterUploadProps = Static<
  typeof CourseBatchPosterUploadModel
>

// Params Course Id
export const ParamsCourseBatchModel = t.Object({
  courseId: t.String({
    format: 'uuid',
    error: 'Format param course id tidak valid',
  }),
  batchId: t.String({
    format: 'uuid',
    error: 'Format param batch id tidak valid',
  }),
})
export type ParamsCourseBatchProps = Static<typeof ParamsCourseBatchModel>

// // Model Update Course Batch
// export const CourseBatchSessionModel = t.Optional(
//   t.Array(
//     t.Object({
//       topic: t.String({
//         minLength: 5,
//         maxLength: 255,
//         error: 'Topik session minimal 5 dan maksimal 255 karakter',
//       }),

//       sessionDate: t.String({
//         format: 'date',
//         error: 'Format sessionDate harus date (YYYY-MM-DD)',
//       }),

//       sessionStartTime: t.String({
//         pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
//         error: 'Format sessionStartTime harus HH:mm (00:00 - 23:59)',
//       }),

//       sessionEndTime: t.String({
//         pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$',
//         error: 'Format sessionEndTime harus HH:mm (00:00 - 23:59)',
//       }),
//     })
//   )
// )
// export type CourseBatchSessionProp = Static<typeof CourseBatchSessionModel>

// export const CourseBatchPriceModel = t.Optional(
//   t.Object({
//     basePrice: t.Number({
//       error: 'Base price harus berupa angka',
//     }),

//     discountType: t.Optional(
//       t.Union([t.Literal('PERCENT'), t.Literal('FIXED')])
//     ),

//     discountValue: t.Optional(
//       t.Number({
//         error: 'Discount value harus berupa angka',
//       })
//     ),

//     finalPrice: t.Optional(
//       t.Number({
//         error: 'Final price harus berupa angka',
//       })
//     ),
//   })
// )

// export type CourseBatchPriceProps = Static<typeof CourseBatchPriceModel>

// export const CourseBatchUpdateModel = t.Object({
//   batchName: t.Optional(
//     t.String({
//       minLength: 5,
//       maxLength: 255,
//       error: 'Nama batch minimal 5 dan maksimal 255 karakter',
//     })
//   ),

//   contributorId: t.Optional(
//     t.String({
//       format: 'uuid',
//       error: 'Format contributorId harus UUID',
//     })
//   ),

//   registrationStart: t.Optional(
//     t.String({
//       format: 'date',
//       error: 'Format registrationStart harus date (YYYY-MM-DD)',
//     })
//   ),

//   registrationEnd: t.Optional(
//     t.String({
//       format: 'date',
//       error: 'Format registrationEnd harus date (YYYY-MM-DD)',
//     })
//   ),

//   startDate: t.Optional(
//     t.String({
//       format: 'date',
//       error: 'Format startDate harus date (YYYY-MM-DD)',
//     })
//   ),

//   endDate: t.Optional(
//     t.String({
//       format: 'date',
//       error: 'Format endDate harus date (YYYY-MM-DD)',
//     })
//   ),

//   batchStatus: t.Optional(
//     t.Enum(BatchStatus, {
//       error: 'Batch status tidak valid',
//     })
//   ),

//   batchSession: CourseBatchSessionModel,
//   batchPrice: CourseBatchPriceModel,
// })

// export type CourseBatchUpdateProps = Static<typeof CourseBatchUpdateModel>
