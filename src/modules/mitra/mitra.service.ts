import {
  BadRequest,
  ResourceNotFoundError,
} from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { MitraCreateProps, MitraUpdateProps } from './mitra.model'

export class MitraService {
  static async addMitra(
    payload: MitraCreateProps,
    urlLogo: string,
    userWhoCreated: string
  ) {
    const { mitraName, businessField } = payload
    const { rows } = await supabasePool.query(
      `INSERT INTO mitras (mitra_name, business_field, mitra_logo_url, created_by, created_date)
                VALUES ($1, $2, $3, $4, NOW()) RETURNING mitra_id`,
      [mitraName, businessField, urlLogo, userWhoCreated]
    )

    return rows[0]
  }

  static async getAllMitra() {
    const { rows } = await supabasePool.query(
      `SELECT mitra_name, business_field, mitra_logo_url FROM mitras WHERE is_deleted = false`
    )
    return rows
  }

  static async getMitraById(mitraId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT mitra_id FROM mitras WHERE mitra_id = $1`,
        [mitraId]
      )
    } catch {
      throw new BadRequest('Invalid mitra_id format')
    }

    if (result.rows.length < 1) {
      throw new ResourceNotFoundError('Resource mitra not found')
    }
    return result.rows[0]
  }

  static async updateMitra(
    mitraId: string,
    payload: Partial<MitraUpdateProps>,
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
