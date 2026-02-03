import { supabasePool } from '../../supabase/supabasePool'

export class AnalyticsService {
  static async getRecentMessages(limit = 5) {
    const { rows } = await supabasePool.query(
      `
      SELECT
        message_id,
        sender_name,
        sender_email,
        subject,
        created_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' AS created_date
      FROM messages
      WHERE is_deleted = false
      ORDER BY created_date DESC
      LIMIT $1
    `,
      [limit]
    )
    return rows
  }

  static async getUpcomingCourses(limit = 5) {
    const { rows } = await supabasePool.query(
      `SELECT
            c.course_id,
            c.course_title,
            cb.course_batch_name,
            cb.course_batch_start_date,
            cb.course_batch_status
        FROM course_batches cb
        JOIN courses c 
        ON cb.course_batch_course_id = c.course_id
        WHERE cb.course_batch_status IN ('SCHEDULED', 'OPEN', 'ON_GOING')
        AND c.is_deleted = false
        ORDER BY CASE cb.course_batch_status
            WHEN 'SCHEDULED' THEN 1
            WHEN 'OPEN' THEN 2
            WHEN 'ON_GOING' THEN 3
            ELSE 4
        END, cb.course_batch_start_date ASC
        LIMIT $1`,
      [limit]
    )

    return rows
  }

  static async getMessageMonthlyStats() {
    const { rows } = await supabasePool.query(
      `WITH last_12_months AS (
        SELECT
            date_trunc(
            'month',
            (CURRENT_DATE AT TIME ZONE 'Asia/Jakarta')
            ) - INTERVAL '1 month' * gs.i AS month_start
        FROM generate_series(0, 11) AS gs(i)
        ),
        
        message_stats AS (
        SELECT
            date_trunc(
            'month',
            created_date AT TIME ZONE 'Asia/Jakarta'
            ) AS month_start,
            COUNT(*)::int AS total
        FROM messages
        WHERE is_deleted = false
        GROUP BY month_start
        )

        SELECT
            to_char(l.month_start, 'Mon YYYY') AS month,
            l.month_start AS sort_key,
            COALESCE(ms.total, 0) AS total
        FROM last_12_months l
        LEFT JOIN message_stats ms
        ON ms.month_start = l.month_start
        ORDER BY l.month_start;
        `
    )
    return rows
  }
}
