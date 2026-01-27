import {
  BadRequest,
  ResourceNotFoundError,
} from '../../../../exceptions/client.error'
import { supabasePool } from '../../../../supabase/supabasePool'

export class CourseMaterialService {
  // static async getCourseMaterialByCourseId(courseId: string) {
  //   let result
  //   try {
  //     result = await supabasePool.query(
  //       `SELECT course_material_title as title, course_material_description as description
  //           FROM course_materials
  //           WHERE course_material_course_id = $1
  //           ORDER BY course_material_order_num`,
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
