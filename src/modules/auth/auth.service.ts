import { BadRequest } from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { SignInProps } from './auth.model'
import * as bcrypt from 'bcrypt'

export class AuthService {
  static verifyUserCredential = async (payload: SignInProps) => {
    const { rows } = await supabasePool.query(
      `SELECT u.user_id, u.password_hash, r.role_name FROM users u
                JOIN roles r ON u.user_role_id = r.role_id
                WHERE username = $1 `,
      [payload.username]
    )

    if (!rows.length) {
      throw new BadRequest('Username Salah')
    }

    const { user_id, password_hash, role_name } = rows[0]

    const isMatch = await bcrypt.compare(payload.password, password_hash)
    if (isMatch === false) {
      throw new BadRequest('Password Salah')
    }

    return { user_id, role_name }
  }

  static saveRefreshToken = async (token: string) => {
    await supabasePool.query(`INSERT INTO authentications VALUES ($1)`, [token])
  }

  static verifyRefreshTokenExist = async (token: string) => {
    const { rows } = await supabasePool.query(
      `SELECT refresh_token FROM authentications WHERE refresh_token = $1`,
      [token]
    )

    if (rows.length === 0) {
      throw new BadRequest('Invalid Refresh Token ')
    }
  }

  static deleteRefreshToken = async (token: string) => {
    await supabasePool.query(
      `DELETE from authentications WHERE refresh_token = $1`,
      [token]
    )
  }
}
