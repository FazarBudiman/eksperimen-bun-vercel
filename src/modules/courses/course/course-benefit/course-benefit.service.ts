import {
  BadRequest,
  ResourceNotFoundError,
} from '../../../../exceptions/client.error'
import { supabasePool } from '../../../../supabase/supabasePool'

export class CourseBenefitService {
  // static async getCourseBenefitByCourseId(courseId: string) {
  //   let result
  //   try {
  //     result = await supabasePool.query(
  //       `SELECT cb.course_benefit_title as title, cb.course_benefit_description as description
  //           FROM course_benefits cb
  //           JOIN courses_course_benefits ccb ON cb.course_benefit_id = ccb.ccb_benefit_id
  //           WHERE ccb.ccb_course_id = $1
  //           ORDER BY ccb.ccb_order_num ASC`,
  //       [courseId]
  //     )
  //   } catch (err) {
  //     console.log(err)
  //     throw new BadRequest('Invalid course_id format')
  //   }
  //   if (result.rows.length < 1) {
  //     throw new ResourceNotFoundError('Resource course not found')
  //   }
  //   return result.rows
  // }
}
