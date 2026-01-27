/*
  Request Body untuk menambah course
  
  {
    courseTitle : '',  
    courseDescription : '',  
    categoryId : '',  
    fieldId : '',  
    createdBy : '',  
    courseBenefits : [
      {
        courseBenefitId : '',
        orderNum: '',
      },
      {
        courseBenefitId : '',
        orderNum: '',
      },
      {
        courseBenefitId : '',
        orderNum: '',
      },
    ]

    courseMaterials : [
      {
        title: '',
        description: '',
        orderNum: '',
      },
      {
        title: '',
        description: '',
        orderNum: '',
      },
      {
        title: '',
        description: '',
        orderNum: '',
      },
    ]

    courseBatches: {
      name: '',
      posterUrl: '',
      instructurName: '',
      registrationStart: '',
      registrationEnd: '',
      StartDate: '',
      EndDate: '',
      prices: {
        basePrice: '',
        discountType: '',
        discountValue: '',
        finalPrice: '',
      }
      sessions: [
        {
          topic : '',
          date : '',
          startTime: '',
          endTime: ''
        }
        
      ]
    }
  }
*/

import { Static, t } from 'elysia'

// import { Static, t } from 'elysia'

// export const CourseStatus = {
//   DRAFT: 'DRAFT',
//   SCHEDULED: 'SCHEDULED',
//   OPEN: 'OPEN',
//   ON_GOING: 'ON_GOING',
// }

// export const CourseCreateModel = t.Object({
//   courseTitle: t.String({
//     minLength: 5,
//     maxLength: 255,
//     error: 'Judul course minimal 5 dan maksimal 255 karakter',
//   }),
//   courseDescription: t.String({
//     minLength: 50,
//     maxLength: 1000,
//     error: 'Deskripsi course minimal 50 dan maksimal 1000 karakter',
//   }),
//   courseCategoryId: t.String({
//     format: 'uuid',
//     error: 'Format uuid tidak valid',
//   }),
//   courseFieldId: t.String({
//     format: 'uuid',
//     error: 'Format uuid tidak valid',
//   }),
//   // courseStatus: t.Enum(CourseStatus, {
//   //   error: 'Status course tidak valid',
//   // }),
//   courseInstructorId: t.String({
//     format: 'uuid',
//     error: 'Format uuid tidak valid',
//   }),
//   coursePoster: t.File({
//     type: ['image/jpeg', 'image/png', 'image/webp'],
//     maxSize: '5m',
//     error:
//       'File harus berupa gambar (JPG, PNG, WEBP) dengan ukuran maksimal 5MB',
//   }),
//   coursePrice: t.String({
//     error: 'harga harus dalam angka',
//   }),
// })

// export type CourseCreateProps = Static<typeof CourseCreateModel>

export const QueryParamsCourseModel = t.Object({
  field: t.Optional(t.String()),
  available: t.Optional(t.Boolean()),
})

export type QueryParamsCourseProps = Static<typeof QueryParamsCourseModel>
