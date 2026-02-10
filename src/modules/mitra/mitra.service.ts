import { ResourceNotFoundError } from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { MitraProps } from './mitra.model'

export class MitraService {
  static async addMitra(
    payload: MitraProps,
    urlLogo: string,
    userWhoCreated: string
  ) {
    const { mitraName, businessField } = payload
    const { rows } = await supabasePool.query(
      `INSERT INTO mitras (
        mitra_name, business_field, mitra_logo_url, 
        created_by, created_date)
      VALUES ($1, $2, $3, $4, NOW()) RETURNING mitra_id`,
      [mitraName, businessField, urlLogo, userWhoCreated]
    )

    return rows[0]
  }

  static async getAllMitra() {
    const { rows } = await supabasePool.query(
      `SELECT 
        mitra_id, mitra_name, business_field, mitra_logo_url 
      FROM mitras 
      WHERE is_deleted = FALSE 
      ORDER BY mitra_name ASC`
    )
    return rows
  }

  static async verifyMitraIsExist(mitraId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 1 FROM mitras
        WHERE mitra_id = $1 AND is_deleted = FALSE`,
      [mitraId]
    )
    if (rows.length === 0) {
      throw new ResourceNotFoundError('Resource mitra tidak ditemukan')
    }
  }

  static async getMitraById(mitraId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 
        mitra_id, mitra_name, business_field, mitra_logo_url 
      FROM mitras WHERE mitra_id = $1 AND is_deleted = FALSE`,
      [mitraId]
    )
    return rows[0]
  }

  static async updateMitra(
    mitraId: string,
    payload: Partial<MitraProps>,
    logoUrl: string | null,
    userWhoUpdated: string
  ) {
    const fields: string[] = []
    const values: any[] = []
    let idx = 1

    if (payload.mitraName) {
      fields.push(`mitra_name = $${idx++}`)
      values.push(payload.mitraName)
    }

    if (payload.businessField) {
      fields.push(`business_field = $${idx++}`)
      values.push(payload.businessField)
    }

    if (logoUrl) {
      fields.push(`mitra_logo_url = $${idx++}`)
      values.push(logoUrl)
    }

    fields.push(`updated_by = $${idx++}`)
    values.push(userWhoUpdated)

    fields.push(`updated_date = NOW()`)

    values.push(mitraId)

    const { rows } = await supabasePool.query(
      `UPDATE mitras 
        SET ${fields.join(', ')}
        WHERE mitra_id = $${idx}
        RETURNING mitra_name`,
      values
    )
    return rows[0]
  }

  static async deleteMitra(mitraId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE mitras SET is_deleted = TRUE WHERE mitra_id = $1 RETURNING mitra_name`,
      [mitraId]
    )
    return rows[0]
  }
}
