import { ResourceNotFoundError } from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import {
  ContributorProps,
  QueryContributorTypeProps,
} from './contributor.model'

export class ContributorService {
  static async addContributor(
    payload: ContributorProps,
    urlProfile: string,
    userWhoCreated: string
  ) {
    const {
      contributorName,
      jobTitle,
      companyName,
      expertise,
      contributorType,
    } = payload
    const { rows } = await supabasePool.query(
      `INSERT INTO contributors (contributor_name, contributor_job_title, contributor_company_name, contributor_expertise, contributor_type, contributor_profile_url, created_by)
            VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING contributor_id`,
      [
        contributorName,
        jobTitle,
        companyName,
        expertise,
        contributorType,
        urlProfile,
        userWhoCreated,
      ]
    )
    return rows[0]
  }

  static async getAllContributor(query: QueryContributorTypeProps) {
    const conditions: string[] = ['is_deleted = FALSE']
    const values: any[] = []
    let idx = 1

    const { type } = query

    if (type) {
      conditions.push(`contributor_type = $${idx++}`)
      values.push(type.toUpperCase())
    }

    const { rows } = await supabasePool.query(
      `SELECT 
        contributor_id, contributor_name, contributor_job_title, contributor_type,
        contributor_company_name, contributor_expertise, contributor_profile_url 
      FROM contributors 
      WHERE ${conditions.join(' AND ')}`,
      values
    )
    return rows
  }

  static async verifyContributorIsExist(contributorId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 1 FROM contributors WHERE contributor_id = $1 AND is_deleted = FALSE`,
      [contributorId]
    )
    if (rows.length === 0) {
      throw new ResourceNotFoundError('Resource contributor tidak ditemukan')
    }
  }

  static async getContributorById(contributorId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 
        contributor_id, contributor_name, contributor_job_title, contributor_type,
        contributor_company_name, contributor_expertise, contributor_profile_url 
      FROM contributors
      WHERE contributor_id = $1 AND is_deleted = FALSE`,
      [contributorId]
    )
    return rows[0]
  }

  static async updateContributor(
    contributorId: string,
    payload: Partial<ContributorProps>,
    profileUrl: string | null,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (payload.contributorName) {
      fields.push(`contributor_name = $${idx++}`)
      values.push(payload.contributorName)
    }

    if (payload.jobTitle) {
      fields.push(`contributor_job_title = $${idx++}`)
      values.push(payload.jobTitle)
    }

    if (payload.companyName) {
      fields.push(`contributor_company_name = $${idx++}`)
      values.push(payload.companyName)
    }

    if (payload.expertise) {
      fields.push(`contributor_expertise = $${idx++}`)
      values.push(payload.expertise)
    }

    if (profileUrl) {
      fields.push(`contributor_profile_url = $${idx++}`)
      values.push(profileUrl)
    }

    if (payload.contributorType) {
      fields.push(`contributor_type = $${idx++}`)
      values.push(payload.contributorType)
    }

    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    fields.push(`updated_date = NOW()`)

    values.push(contributorId)

    const { rows } = await supabasePool.query(
      `UPDATE contributors
     SET ${fields.join(', ')}
     WHERE contributor_id = $${idx}
     RETURNING contributor_name`,
      values
    )

    return rows[0]
  }

  static async deleteContributor(contributorId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE contributors SET is_deleted = TRUE WHERE contributor_id = $1 RETURNING contributor_name`,
      [contributorId]
    )
    return rows[0]
  }
}
