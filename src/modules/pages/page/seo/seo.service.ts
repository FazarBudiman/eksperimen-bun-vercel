import { ResourceNotFoundError } from '../../../../exceptions/client.error'
import { supabasePool } from '../../../../supabase/supabasePool'
import { ParamsSeoProps, SeoProps } from './seo.model'

export class SeoService {
  static async addSeo(
    payload: SeoProps,
    pageId: string,
    userWhoCreated: string
  ) {
    const { metaTitle, metaDescription } = payload
    const { rows } = await supabasePool.query(
      `INSERT INTO seos (seo_page_id, meta_title, meta_description, created_by)
        VALUES ($1, $2, $3, $4) RETURNING seo_id`,
      [pageId, metaTitle, metaDescription, userWhoCreated]
    )
    return rows[0]
  }

  static async getSeoByPageId(pageId: string) {
    const { rows } = await supabasePool.query(
      `SELECT seo_id, meta_title, meta_description, is_active
        FROM seos 
        WHERE is_deleted = FALSE AND seo_page_id = $1`,
      [pageId]
    )
    return rows
  }

  static async getSeoById(seoId: string) {
    const { rows } = await supabasePool.query(
      `SELECT seo_id, meta_title, meta_description, is_active
        FROM seos
        WHERE is_deleted = FALSE AND seo_id = $1`,
      [seoId]
    )
    return rows[0]
  }

  static async verifySeoIsExist(seoId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 1 FROM seos WHERE seo_id = $1`,
      [seoId]
    )

    if (rows.length === 0) {
      throw new ResourceNotFoundError('Resource seo tidak ditemukan')
    }
  }

  static async updateSeo(
    payload: Partial<SeoProps>,
    params: ParamsSeoProps,
    userWhoUpdated: string
  ) {
    const { seoId } = params
    const fields: String[] = []
    const values: any[] = []
    let idx = 1

    if (payload.metaTitle) {
      fields.push(`meta_title = $${idx++}`)
      values.push(payload.metaTitle)
    }

    if (payload.metaDescription) {
      fields.push(`meta_description = $${idx++}`)
      values.push(payload.metaDescription)
    }

    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    values.push(seoId)

    const { rows } = await supabasePool.query(
      `UPDATE seos
      SET ${fields.join(', ')}
      WHERE seo_id = $${idx} RETURNING seo_id`,
      values
    )
    return rows[0]
  }

  static async changeStatusSeo(seoId: string, userWhoUpdated: string) {
    const { rows } = await supabasePool.query(
      `UPDATE seos  
      SET 
        is_active = NOT is_active, 
        created_by = $1, updated_date = NOW()
      WHERE seo_id = $2 
      RETURNING seo_id`,
      [userWhoUpdated, seoId]
    )
    return rows[0]
  }

  static async deleteSeo(params: ParamsSeoProps) {
    const { seoId } = params
    const { rows } = await supabasePool.query(
      `UPDATE seos 
        SET is_deleted = TRUE
        WHERE seo_id = $1
        RETURNING seo_id`,
      [seoId]
    )
    return rows[0]
  }
}
