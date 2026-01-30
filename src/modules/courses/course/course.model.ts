import { Static, t } from 'elysia'
import { CourseBenefitModel } from '../courses-benefit/course-benefit.model'
import { CourseMaterialModel } from './course-material/course-material.model'

// Model Request Body Course
export const CourseModel = t.Object({
  courseTitle: t.String({
    minLength: 5,
    maxLength: 255,
    error: 'Judul course minimal 5 dan maksimal 255 karakter',
  }),
  courseDescription: t.String({
    minLength: 50,
    maxLength: 1000,
    error: 'Deskripsi course minimal 50 dan maksimal 1000 karakter',
  }),
  courseCategoryId: t.String({
    format: 'uuid',
    error: 'Format uuid tidak valid',
  }),
  courseFieldId: t.String({
    format: 'uuid',
    error: 'Format uuid tidak valid',
  }),
  courseBenefits: CourseBenefitModel,
  courseMaterials: CourseMaterialModel,
})

export type CourseProps = Static<typeof CourseModel>

// Model Query Parameter Get All Course
export const QueryCourseModel = t.Object({
  field: t.Optional(
    t.String({
      error: "query 'field' harus merupakan string",
    })
  ),
  available: t.Optional(
    t.Boolean({
      error: "Query 'available' harus merupakan boolean",
    })
  ),
})

export type QueryCourseProps = Static<typeof QueryCourseModel>

// Params Course Id
export const ParamsCourseModel = t.Object({
  courseId: t.String({
    format: 'uuid',
    error: 'Format param course id tidak valid',
  }),
})

export type ParamsCourseProps = Static<typeof ParamsCourseModel>
