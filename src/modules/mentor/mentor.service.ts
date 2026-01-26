import {
  BadRequest,
  ResourceNotFoundError,
} from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { MentorCreateProps } from './mentor.model'

export class MentorService {
  static async addMentor(
    payload: MentorCreateProps,
    userWhoCreated: string,
    urlProfile: string
  ) {
    const { mentorName, jobTitle, companyName, expertise } = payload
    const { rows } = await supabasePool.query(
      `INSERT INTO mentors (mentor_name, mentor_job_title, mentor_company_name, mentor_expertise, mentor_profile_url, created_by)
            VALUES($1, $2, $3, $4, $5, $6) RETURNING mentor_id`,
      [mentorName, jobTitle, companyName, expertise, urlProfile, userWhoCreated]
    )
    return rows[0]
  }

  static async getAllMentor() {
    const { rows } = await supabasePool.query(
      `SELECT mentor_id, mentor_name, mentor_job_title, mentor_company_name, mentor_expertise, mentor_profile_url 
        FROM mentors WHERE is_deleted = FALSE`
    )
    return rows
  }

  static async getMentorById(mentorId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT mentor_id FROM mentors WHERE mentor_id = $1 AND is_deleted = FALSE`,
        [mentorId]
      )
    } catch {
      throw new BadRequest('Invalid mentor_id format')
    }

    if (result.rows.length < 1) {
      throw new ResourceNotFoundError('Resource mentor not found')
    }
    return result.rows[0]
  }

  static async updateMentor(
    mentorId: string,
    payload: Partial<MentorCreateProps>,
    profileUrl: string | null,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (payload.mentorName) {
      fields.push(`mentor_name = $${idx++}`)
      values.push(payload.mentorName)
    }

    if (payload.jobTitle) {
      fields.push(`mentor_job_title = $${idx++}`)
      values.push(payload.jobTitle)
    }

    if (payload.companyName) {
      fields.push(`mentor_company_name = $${idx++}`)
      values.push(payload.companyName)
    }

    if (payload.expertise) {
      fields.push(`mentor_expertise = $${idx++}`)
      values.push(payload.expertise)
    }

    if (profileUrl) {
      fields.push(`mentor_profile_url = $${idx++}`)
      values.push(profileUrl)
    }

    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    fields.push(`updated_date = NOW()`)

    values.push(mentorId)

    const { rows } = await supabasePool.query(
      `UPDATE mentors
     SET ${fields.join(', ')}
     WHERE mentor_id = $${idx}
     RETURNING mentor_name`,
      values
    )

    return rows[0]
  }

  static async deleteMentor(mentorId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE mentors SET is_deleted = TRUE WHERE mentor_id = $1 RETURNING mentor_name`,
      [mentorId]
    )
    return rows[0]
  }
}
