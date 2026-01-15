import {
  BadRequest,
  ResourceNotFoundError,
} from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { MentorCreateProps } from './mentor.model'

export class MentorService {
  static async addMentor(payload: MentorCreateProps, userWhoCreated: string) {
    const { mentorName, jobTitle, companyName, expertise, profileUrl } = payload
    const { rows } = await supabasePool.query(
      `INSERT INTO mentors (mentors_name, job_title, company_name, expertise, profile_url, created_by)
            VALUES($1, $2, $3, $4, $5, $6) RETURNING mentors_id`,
      [mentorName, jobTitle, companyName, expertise, profileUrl, userWhoCreated]
    )
    return rows[0]
  }

  static async getAllMentor() {
    const { rows } = await supabasePool.query(
      `SELECT mentors_id, mentors_name, job_title, company_name, expertise, profile_url 
        FROM mentors WHERE is_deleted = FALSE`
    )
    return rows
  }

  static async getMentorById(mentorId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT mentors_id FROM mentors WHERE mentors_id = $1 AND is_deleted = FALSE`,
        [mentorId]
      )
    } catch {
      throw new BadRequest('Invalid mentors_id format')
    }

    if (result.rows.length < 1) {
      throw new ResourceNotFoundError('Resource mentor not found')
    }
    return result.rows[0]
  }

  static async updateMentor(
    mentorId: string,
    payload: MentorCreateProps,
    userWhoUpdated: string
  ) {
    const { mentorName, jobTitle, companyName, expertise, profileUrl } = payload
    const { rows } = await supabasePool.query(
      `UPDATE mentors SET mentors_name = $1, job_title = $2, company_name = $3, expertise = $4, profile_url = $5, updated_by = $6, updated_date = NOW() 
        WHERE mentors_id = $7 RETURNING mentors_name`,
      [
        mentorName,
        jobTitle,
        companyName,
        expertise,
        profileUrl,
        userWhoUpdated,
        mentorId,
      ]
    )
    return rows[0]
  }

  static async deleteMentor(mentorId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE mentors SET is_deleted = TRUE WHERE mentors_id = $1 RETURNING mentors_name`,
      [mentorId]
    )
    return rows[0]
  }
}
