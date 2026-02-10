import { ResourceNotFoundError } from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { QueryTestimoniProps, TestimoniProps } from './testimoni.model'

export class TestimoniService {
  static async addTestimoni(
    payload: TestimoniProps,
    authorProfileUrl: string,
    userWhoCreated: string
  ) {
    const {
      authorName,
      authorJobTitle,
      authorCompanyName,
      testimoniContent,
      testimoniCategory,
    } = payload

    const { rows } = await supabasePool.query(
      `INSERT INTO testimonies(
        author_name, author_job_title, author_company_name, 
        author_profile_url, testimoni_content, testimoni_category, created_by)
      VALUES($1, $2, $3, $4, $5, $6, $7) 
      RETURNING testimoni_id`,
      [
        authorName,
        authorJobTitle,
        authorCompanyName,
        authorProfileUrl,
        testimoniContent,
        testimoniCategory,
        userWhoCreated,
      ]
    )

    return rows[0]
  }

  static async getAllTestimoni(query: QueryTestimoniProps) {
    const conditions: string[] = ['is_deleted = FALSE']
    const values: any[] = []
    let idx = 1

    const { category } = query
    if (category) {
      conditions.push(`testimoni_category = $${idx++}`)
      values.push(category.toUpperCase())
    }
    const { rows } = await supabasePool.query(
      `SELECT 
        testimoni_id, author_name, author_job_title, author_company_name, 
        author_profile_url, testimoni_content 
      FROM testimonies
      WHERE ${conditions.join(' AND ')}`,
      values
    )
    return rows
  }

  static async verifyTestimoniIsExist(testimoniId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 1 FROM testimonies WHERE testimoni_id = $1 AND is_deleted = FALSE`,
      [testimoniId]
    )
    if (rows.length === 0) {
      throw new ResourceNotFoundError('Resource testimoni tidak ditemukan')
    }
  }

  static async getTestimoniById(testimoniId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 
        testimoni_id, author_name, author_job_title, author_company_name, 
        author_profile_url, testimoni_content  
      FROM testimonies WHERE testimoni_id = $1`,
      [testimoniId]
    )

    return rows[0]
  }

  static async updateTestimoni(
    testimoniId: string,
    payload: Partial<TestimoniProps>,
    authorProfileUrl: string | null,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (payload.authorName) {
      fields.push(`author_name = $${idx++}`)
      values.push(payload.authorName)
    }
    if (payload.authorJobTitle) {
      fields.push(`author_job_title = $${idx++}`)
      values.push(payload.authorJobTitle)
    }
    if (payload.authorCompanyName) {
      fields.push(`author_company_name = $${idx++}`)
      values.push(payload.authorCompanyName)
    }
    if (payload.testimoniContent) {
      fields.push(`testimoni_content = $${idx++}`)
      values.push(payload.testimoniContent)
    }
    if (payload.testimoniCategory) {
      fields.push(`testimoni_category = $${idx++}`)
      values.push(payload.testimoniCategory)
    }
    if (authorProfileUrl) {
      fields.push(`author_profile_url = $${idx++}`)
      values.push(authorProfileUrl)
    }
    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)
    fields.push(`updated_date = NOW()`)

    values.push(testimoniId)

    const { rows } = await supabasePool.query(
      `UPDATE testimonies
            SET ${fields.join(', ')}
            WHERE testimoni_id = $${idx}
            RETURNING author_name`,
      values
    )

    return rows[0]
  }

  static async deleteTestimoni(testimoniId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE testimonies SET is_deleted = True WHERE testimoni_id = $1 RETURNING author_name`,
      [testimoniId]
    )
    return rows[0]
  }
}
