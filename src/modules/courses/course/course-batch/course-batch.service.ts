import { PoolClient } from 'pg'
import { ResourceNotFoundError } from '../../../../exceptions/client.error'
import { supabasePool } from '../../../../supabase/supabasePool'
import {
  CourseBatchProps,
  CoursePriceProps,
  CourseSessionProps,
} from './course-batch.model'

export class CourseBatchService {
  static async addCourseBatch(
    payload: CourseBatchProps,
    courseId: string,
    userWhocreated: string
  ) {
    const client = await supabasePool.connect()
    const {
      batchName,
      contributorId,
      registrationStart,
      registrationEnd,
      startDate,
      endDate,
      batchStatus,
      batchSession,
      batchPrice,
    } = payload

    try {
      const { rows } = await client.query(
        `INSERT INTO course_batches (
          course_batch_course_id, course_batch_name,
          course_batch_contributor_id, course_batch_registration_start, 
          course_batch_registration_end, course_batch_start_date,
          course_batch_end_date, course_batch_status, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING course_batch_id`,
        [
          courseId,
          batchName,
          contributorId,
          registrationStart,
          registrationEnd,
          startDate,
          endDate,
          batchStatus,
          userWhocreated,
        ]
      )

      const { course_batch_id } = rows[0]

      await Promise.all(
        batchSession.map((session) =>
          client.query(
            `INSERT INTO course_sessions (
            course_session_batch_id, course_session_topic, 
            course_session_date, course_session_start_time, 
            course_session_end_time)
          VALUES ($1, $2, $3, $4, $5)`,
            [
              course_batch_id,
              session.topic,
              session.sessionDate,
              session.sessionStartTime,
              session.sessionEndTime,
            ]
          )
        )
      )

      await client.query(
        `INSERT INTO course_prices (
          course_price_course_batch_id, base_price, 
          discount_type, discount_value, final_price)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          course_batch_id,
          batchPrice.basePrice,
          batchPrice.discountType,
          batchPrice.discountValue,
          batchPrice.finalPrice,
        ]
      )
      return course_batch_id
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  static async verfifyCourseBatchisExist(batchId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 1 FROM course_batches WHERE course_batch_id = $1`,
      [batchId]
    )

    if (rows.length === 0) {
      throw new ResourceNotFoundError('Resource batch of course not found')
    }
  }

  static async addPosterUrlIntoBatch(
    posterUrl: string,
    batchId: string,
    userWhoUpdated: string
  ) {
    await supabasePool.query(
      `UPDATE course_batches 
      SET course_batch_poster_url = $1, 
        updated_by = $2, updated_date = NOW() 
      WHERE course_batch_id = $3`,
      [posterUrl, userWhoUpdated, batchId]
    )
  }

  static async getCourseBatchByBatchId(courseId: string, batchId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 
        cb.course_batch_id,
        cb.course_batch_name as name,
        cb.course_batch_poster_url as poster_url,
        cb.course_batch_registration_start as registration_start,
        cb.course_batch_registration_end as registration_end,
        cb.course_batch_start_date as start_date,
        cb.course_batch_end_date as end_date,
        cb.course_batch_status as batch_status,

        c.contributor_name as instructor_name,
        c.contributor_id as instructor_id,
        c.contributor_job_title as instructor_job_title,
        c.contributor_company_name as instructor_company_name,
        c.contributor_profile_url as instructor_profile_url,

        cp.base_price,
        cp.discount_type,
        cp.discount_value,
        cp.final_price,

        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'course_session_id', cs.course_session_id,
              'topic', cs.course_session_topic,
              'date', cs.course_session_date,
              'start_time', cs.course_session_start_time,
              'end_time', cs.course_session_end_time
            )
              ORDER BY cs.course_session_date, cs.course_session_start_time
          ) FILTER (WHERE cs.course_session_id IS NOT NULL),
          '[]'
        ) as sessions

      FROM course_batches cb

      JOIN contributors c 
        ON cb.course_batch_contributor_id = c.contributor_id

      JOIN course_prices cp
        ON cb.course_batch_id = cp.course_price_course_batch_id 

      LEFT JOIN course_sessions cs
        ON cb.course_batch_id = cs.course_session_batch_id

      WHERE cb.course_batch_course_id = $1 AND cb.course_batch_id = $2 AND cb.is_deleted = FALSE

      GROUP BY
        cb.course_batch_id,
        c.contributor_id,
        cp.base_price,
        cp.discount_type,
        cp.discount_value,
        cp.final_price;`,
      [courseId, batchId]
    )
    return rows[0] ?? null
  }

  static async getCourseBatchByCourseId(courseId: string) {
    const { rows } = await supabasePool.query(
      // `SELECT
      //   cb.course_batch_id, cb.course_batch_name as name, cb.course_batch_poster_url as poster_url,
      //     cb.course_batch_registration_start as registration_start,
      //     cb.course_batch_registration_end as registration_end,
      //     cb.course_batch_start_date as start_date, cb.course_batch_end_date as end_date,
      //     cb.course_batch_status as batch_status,
      //   c.contributor_name as instructor_name, c.contributor_job_title as instrutor_job_title,
      //     c.contributor_company_name as instructor_company_name,
      //     c.contributor_profile_url as instructor_profile_url,
      //   cp.base_price, cp.discount_type, cp.discount_value, cp.final_price
      // FROM course_batches cb
      // JOIN contributors c
      //   ON cb.course_batch_contributor_id = c.contributor_id
      // JOIN course_prices cp
      //   ON cb.course_batch_id = cp.course_price_course_batch_id
      // WHERE course_batch_course_id = $1`,
      `SELECT 
        cb.course_batch_id,
        cb.course_batch_name as name,
        cb.course_batch_poster_url as poster_url,
        cb.course_batch_registration_start as registration_start,
        cb.course_batch_registration_end as registration_end,
        cb.course_batch_start_date as start_date,
        cb.course_batch_end_date as end_date,
        cb.course_batch_status as batch_status,

        c.contributor_name as instructor_name,
        c.contributor_id as instructor_id,
        c.contributor_job_title as instructor_job_title,
        c.contributor_company_name as instructor_company_name,
        c.contributor_profile_url as instructor_profile_url,

        cp.base_price,
        cp.discount_type,
        cp.discount_value,
        cp.final_price,

        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'course_session_id', cs.course_session_id,
              'topic', cs.course_session_topic,
              'date', cs.course_session_date,
              'start_time', cs.course_session_start_time,
              'end_time', cs.course_session_end_time
            )
          ) FILTER (WHERE cs.course_session_id IS NOT NULL),
          '[]'
        ) as sessions

      FROM course_batches cb

      JOIN contributors c 
        ON cb.course_batch_contributor_id = c.contributor_id

      JOIN course_prices cp
        ON cb.course_batch_id = cp.course_price_course_batch_id 

      LEFT JOIN course_sessions cs
        ON cb.course_batch_id = cs.course_session_batch_id

      WHERE cb.course_batch_course_id = $1 AND cb.is_deleted = FALSE

      GROUP BY
        cb.course_batch_id,
        c.contributor_id,
        cp.base_price,
        cp.discount_type,
        cp.discount_value,
        cp.final_price;`,
      [courseId]
    )
    return rows
  }

  static async updateCourseBatchMain(
    client: PoolClient,
    payload: Partial<CourseBatchProps>,
    batchId: string,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1
    const {
      batchName,
      contributorId,
      registrationStart,
      registrationEnd,
      startDate,
      endDate,
      batchStatus,
    } = payload

    if (batchName) {
      fields.push(`course_batch_name = $${idx++}`)
      values.push(batchName)
    }
    if (contributorId) {
      fields.push(`course_batch_contributor_id = $${idx++}`)
      values.push(contributorId)
    }
    if (registrationStart) {
      fields.push(`course_batch_registration_start = $${idx++}`)
      values.push(registrationStart)
    }
    if (registrationEnd) {
      fields.push(`course_batch_registration_end = $${idx++}`)
      values.push(registrationEnd)
    }
    if (startDate) {
      fields.push(`course_batch_start_date = $${idx++}`)
      values.push(startDate)
    }
    if (endDate) {
      fields.push(`course_batch_end_date = $${idx++}`)
      values.push(endDate)
    }
    if (batchStatus) {
      fields.push(`course_batch_status = $${idx++}`)
      values.push(batchStatus)
    }

    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    fields.push(`updated_date = NOW()`)

    values.push(batchId)

    const { rows } = await supabasePool.query(
      `UPDATE course_batches SET ${fields.join(', ')}
        WHERE course_batch_id = $${idx} RETURNING course_batch_name`,
      values
    )

    return rows[0]
  }

  static async replaceCourseBatchSession(
    client: PoolClient,
    batchId: string,
    sessions: CourseSessionProps
  ) {
    await client.query(
      `DELETE FROM course_sessions WHERE course_session_batch_id = $1`,
      [batchId]
    )

    for (const s of sessions) {
      await client.query(
        `INSERT INTO course_sessions (
            course_session_batch_id, course_session_topic, 
            course_session_date, course_session_start_time, 
            course_session_end_time)
          VALUES ($1, $2, $3, $4, $5)`,
        [batchId, s.topic, s.sessionDate, s.sessionStartTime, s.sessionEndTime]
      )
    }
  }

  static async updateCourseBatchPrice(
    client: PoolClient,
    batchId: string,
    prices: Partial<CoursePriceProps>
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (prices.basePrice !== undefined) {
      fields.push(`base_price = $${idx++}`)
      values.push(prices.basePrice)
    }

    if (prices.discountType !== undefined) {
      fields.push(`discount_type = $${idx++}`)
      values.push(prices.discountType)
    }

    if (prices.discountValue !== undefined) {
      fields.push(`discount_value = $${idx++}`)
      values.push(prices.discountValue)
    }

    if (prices.finalPrice !== undefined) {
      fields.push(`final_price = $${idx++}`)
      values.push(prices.finalPrice)
    }

    // nothing to update → avoid invalid SQL
    if (fields.length === 0) return

    values.push(batchId)

    await client.query(
      `UPDATE course_prices
     SET ${fields.join(', ')}
     WHERE course_price_course_batch_id = $${idx}`,
      values
    )
  }

  static async updateCourseBatch(
    payload: Partial<CourseBatchProps>,
    batchId: string,
    userWhoUpdated: string
  ) {
    const client = await supabasePool.connect()

    try {
      await client.query('BEGIN')

      const { course_batch_name } =
        await CourseBatchService.updateCourseBatchMain(
          client,
          payload,
          batchId,
          userWhoUpdated
        )

      if (payload.batchSession) {
        await CourseBatchService.replaceCourseBatchSession(
          client,
          batchId,
          payload.batchSession
        )
      }

      if (payload.batchPrice) {
        await CourseBatchService.updateCourseBatchPrice(
          client,
          batchId,
          payload.batchPrice
        )
      }

      await client.query('COMMIT')
      return course_batch_name
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  static async deleteCourseBatch(batchId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE course_batches SET is_deleted = TRUE
        WHERE course_batch_id = $1 
        RETURNING course_batch_name`,
      [batchId]
    )

    return rows[0]
  }
}
