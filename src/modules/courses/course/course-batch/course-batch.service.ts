import {
  BadRequest,
  ResourceNotFoundError,
} from '../../../../exceptions/client.error'
import { supabasePool } from '../../../../supabase/supabasePool'

export class CourseBatchService {
  // static async getCourseBatchByCourseId(courseId: string) {
  //   let result
  //   try {
  //     result = await supabasePool.query(
  //       `SELECT
  //           cb.course_batch_name as name,
  //           cb.course_batch_poster_url as posterUrl,
  //           cb.course_batch_registration_start as registration_start,
  //           cb.course_batch_registration_end as registration_end,
  //           cb.course_batch_start_date as start_date,
  //           cb.course_batch_end_date as start_end,
  //           json_build_object(
  //               'name', c.contributor_name,
  //               'jobTitle', c.contributor_job_title,
  //               'companyName', c.contributor_company_name,
  //               'profileUrl', c.contributor_profile_url
  //           ) as instructor,
  //           json_build_object(
  //               'basePrice', cp.base_price,
  //               'discountType', cp.discount_type,
  //               'discountValue', cp.discount_value,
  //               'finalPrice', cp.final_price
  //           ) as prices,
  //           json_agg(
  //               json_build_object(
  //               'topic', cs.course_session_topic,
  //               'date', cs.course_session_date,
  //               'startTime', cs.course_session_start_time,
  //               'endTime', cs.course_session_end_time
  //               ) ORDER BY cs.course_session_date
  //           ) as sessions
  //           FROM course_batches cb
  //           LEFT JOIN course_prices cp ON cb.course_batch_id = cp.course_price_course_batch_id
  //           LEFT JOIN course_sessions cs ON cb.course_batch_id = cs.course_session_batch_id
  //           LEFT JOIN contributors c ON cb.course_batch_contributor_id = c.contributor_id
  //           WHERE cb.course_batch_course_id = $1
  //           GROUP BY cb.course_batch_id, cp.course_price_id, c.contributor_id;`,
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
