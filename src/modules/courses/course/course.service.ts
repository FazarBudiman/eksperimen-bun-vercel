import {
  BadRequest,
  ResourceNotFoundError,
} from '../../../exceptions/client.error'
import { supabasePool } from '../../../supabase/supabasePool'
import { QueryParamsCourseProps } from './course.model'
// import { CourseCreateProps } from './course.model'

export class CourseService {
  // static async addCourse(
  //   payload: CourseCreateProps,
  //   coursePosterUrl: string,
  //   userWhocreated: string
  // ) {
  //   const {
  //     courseTitle,
  //     courseDescription,
  //     courseCategoryId,
  //     courseFieldId,
  //     courseInstructorId,
  //     coursePrice,
  //   } = payload

  //   const { rows } = await supabasePool.query(
  //     `INSERT INTO courses (course_title, course_description, course_category_id, course_field_id, course_instructor_id, course_status, course_poster_url, course_price, created_by)
  //           VALUES ($1, $2, $3, $4, $5, 'DRAFT' , $6, $7, $8) RETURNING course_id`,
  //     [
  //       courseTitle,
  //       courseDescription,
  //       courseCategoryId,
  //       courseFieldId,
  //       courseInstructorId,
  //       coursePosterUrl,
  //       coursePrice,
  //       userWhocreated,
  //     ]
  //   )
  //   return rows[0]
  // }

  static async verifyCourseisExist(courseId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT 1 FROM courses WHERE course_id = $1 AND is_deleted = false`,
        [courseId]
      )
    } catch {
      throw new BadRequest('Invalid course_id format')
    }
    if (result.rows.length === 0) {
      throw new ResourceNotFoundError('Resource course not found')
    }
  }

  static async getAllCourses(query: QueryParamsCourseProps) {
    const values: any[] = []
    const conditions: string[] = []

    if (query.field) {
      values.push(query.field)
      conditions.push(
        `lower(cf.course_field_name) LIKE lower($${values.length})`
      )
    }

    if (query.available !== undefined) {
      values.push(query.available)
      conditions.push(`
      EXISTS (
        SELECT 1
        FROM course_batches cb
        WHERE cb.course_batch_course_id = c.course_id
          AND cb.course_batch_registration_start <= NOW()
          AND cb.course_batch_registration_end >= NOW()
      ) = $${values.length}
    `)
    }

    const whereClause = conditions.length
      ? `AND ${conditions.join(' AND ')}`
      : ''

    const { rows } = await supabasePool.query(
      `
      SELECT
        c.course_id,
        c.course_title,
        c.course_description,
        cc.course_category_name,
        cf.course_field_name,

      COALESCE(
        (
          SELECT json_build_object(
            'name', cb.course_batch_name,
            'status', cb.course_batch_status,
            'posterUrl', cb.course_batch_poster_url,
            'registration_start', cb.course_batch_registration_start,
            'registration_end', cb.course_batch_registration_end,
            'start_date', cb.course_batch_start_date,
            'end_date', cb.course_batch_end_date,

            'instructor', json_build_object(
              'name', ctr.contributor_name,
              'jobTitle', ctr.contributor_job_title,
              'companyName', ctr.contributor_company_name,
              'profileUrl', ctr.contributor_profile_url
            ),

            'prices', json_build_object(
              'basePrice', cp.base_price,
              'discountType', cp.discount_type,
              'discountValue', cp.discount_value,
              'finalPrice', cp.final_price
            )
          )
            
            FROM course_batches cb
            LEFT JOIN contributors ctr
              ON cb.course_batch_contributor_id = ctr.contributor_id
            LEFT JOIN course_prices cp
              ON cb.course_batch_id = cp.course_price_course_batch_id
            WHERE cb.course_batch_course_id = c.course_id
            ORDER BY cb.course_batch_start_date DESC
            LIMIT 1
        ),'{}'::json
      ) AS course_batch

      FROM courses c
      JOIN course_categories cc ON c.category_id = cc.course_category_id
      JOIN course_fields cf ON c.field_id = cf.course_field_id
      WHERE c.is_deleted = false
      ${whereClause}
      ORDER BY c.created_date DESC
      `,
      values
    )

    return rows
  }

  static async getUpcomingCourse() {
    const { rows } = await supabasePool.query(
      `
      WITH nearest_open_batch AS (
        SELECT DISTINCT ON (cb.course_batch_course_id)
          cb.course_batch_course_id,
          cb.course_batch_id
        FROM course_batches cb
        WHERE cb.course_batch_status = 'OPEN'
        AND CURRENT_DATE BETWEEN cb.course_batch_registration_start AND cb.course_batch_registration_end
        ORDER BY cb.course_batch_course_id, cb.course_batch_start_date ASC
      )

      SELECT DISTINCT ON (cc.course_category_id)
        c.course_id,
        c.course_title,
        c.course_description,
        cc.course_category_name,

        json_build_object(
          'name', cb.course_batch_name,
          'posterUrl', cb.course_batch_poster_url,
          'start_date', cb.course_batch_start_date,
          'registration_end', cb.course_batch_registration_end
        ) AS nearest_batch

      FROM nearest_open_batch nob
      JOIN courses c
        ON nob.course_batch_course_id = c.course_id
      JOIN course_categories cc
        ON c.category_id = cc.course_category_id
      JOIN course_batches cb
        ON nob.course_batch_id = cb.course_batch_id
      WHERE c.is_deleted = false
      ORDER BY cc.course_category_id, cb.course_batch_start_date ASC;
      `
    )
    return rows
  }

  static async getDetailCourseById(courseId: string) {
    const { rows } = await supabasePool.query(
      `SELECT
        c.course_id,
        c.course_title,
        c.course_description,
        cc.course_category_name,
        cf.course_field_name,

        /* ===== COURSE MATERIALS ===== */
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'title', cm.course_material_title,
                        'description', cm.course_material_description
                    )
                    ORDER BY cm.course_material_order_num
                )
                FROM course_materials cm
                WHERE cm.course_material_course_id = c.course_id
            ),
            '[]'::json
        ) AS course_material,

        /* ===== COURSE BENEFITS ===== */
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'title', cb.course_benefit_title,
                        'description', cb.course_benefit_description
                    )
                    ORDER BY ccb.ccb_order_num
                )
                FROM courses_course_benefits ccb
                JOIN course_benefits cb
                  ON cb.course_benefit_id = ccb.ccb_benefit_id
                WHERE ccb.ccb_course_id = c.course_id
            ),
            '[]'::json
        ) AS course_benefit,

        /* ===== COURSE BATCHES ===== */
        COALESCE(
            (
                SELECT json_agg(
                    json_build_object(
                        'name', cb.course_batch_name,
                        'posterUrl', cb.course_batch_poster_url,
                        'registration_start', cb.course_batch_registration_start,
                        'registration_end', cb.course_batch_registration_end,
                        'start_date', cb.course_batch_start_date,
                        'end_date', cb.course_batch_end_date,

                        'instructor', json_build_object(
                            'name', ctr.contributor_name,
                            'jobTitle', ctr.contributor_job_title,
                            'companyName', ctr.contributor_company_name,
                            'profileUrl', ctr.contributor_profile_url
                        ),

                        'prices', json_build_object(
                            'basePrice', cp.base_price,
                            'discountType', cp.discount_type,
                            'discountValue', cp.discount_value,
                            'finalPrice', cp.final_price
                        ),

                        'sessions',
                            COALESCE(
                                (
                                    SELECT json_agg(
                                        json_build_object(
                                            'topic', cs.course_session_topic,
                                            'date', cs.course_session_date,
                                            'startTime', cs.course_session_start_time,
                                            'endTime', cs.course_session_end_time
                                        )
                                        ORDER BY cs.course_session_date
                                    )
                                    FROM course_sessions cs
                                    WHERE cs.course_session_batch_id = cb.course_batch_id
                                ),
                                '[]'::json
                            )
                    )
                )
                FROM course_batches cb
                LEFT JOIN contributors ctr
                  ON cb.course_batch_contributor_id = ctr.contributor_id
                LEFT JOIN course_prices cp
                  ON cb.course_batch_id = cp.course_price_course_batch_id
                WHERE cb.course_batch_course_id = c.course_id
            ),
            '[]'::json
        ) AS course_batch

    FROM courses c
    JOIN course_categories cc ON c.category_id = cc.course_category_id
    JOIN course_fields cf ON c.field_id = cf.course_field_id
    WHERE c.course_id = $1
      AND c.is_deleted = false;
    `,
      [courseId]
    )
    return rows
  }
}
