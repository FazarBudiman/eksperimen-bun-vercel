import { PoolClient } from 'pg'
import { supabasePool } from '../../../supabase/supabasePool'
import { CourseBenefitProps } from './course-benefit.model'

export class CourseBenefitService {
  static async getAllCourseBenefit() {
    const { rows } = await supabasePool.query(
      `SELECT course_benefit_id as id, course_benefit_title as title, course_benefit_description as description
      FROM course_benefits`
    )
    return rows
  }

  static async replaceCourseBenefits(
    client: PoolClient,
    courseId: string,
    benefits: CourseBenefitProps
  ) {
    await client.query(
      `DELETE FROM courses_course_benefits WHERE ccb_course_id = $1`,
      [courseId]
    )

    for (const b of benefits) {
      await client.query(
        `INSERT INTO courses_course_benefits(
            ccb_course_id, ccb_benefit_id, ccb_order_num)
          VALUES ($1, $2, $3)`,
        [courseId, b.courseBenefitId, b.orderNum]
      )
    }
  }

  static async getCourseBenefitByCourseId(courseId: string) {
    const { rows } = await supabasePool.query(
      `SELECT cb.course_benefit_title as title, cb.course_benefit_description as description
        FROM course_benefits cb 
        JOIN courses_course_benefits ccb 
          ON cb.course_benefit_id = ccb.ccb_benefit_id
        WHERE ccb.ccb_course_id = $1
        ORDER BY ccb.ccb_order_num ASC`,
      [courseId]
    )
    return rows
  }
}
