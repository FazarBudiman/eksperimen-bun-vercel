import { BadRequest } from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { Role } from '../../types/role.type'
import { SignInProps } from './auth.model'
import * as bcrypt from 'bcrypt'

export class AuthService {
  static verifyUserCredential = async (payload: SignInProps) => {
    const { rows } = await supabasePool.query(
      `SELECT u.user_id, u.password_hash, r.role_name FROM users u
                JOIN roles r ON u.user_role_id = r.role_id
                WHERE u.username = $1 AND u.is_deleted = FALSE`,
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

  static getUserPermissions = async (role: Role): Promise<string[]> => {
    const { rows } = await supabasePool.query(
      `SELECT ARRAY_AGG(p.permission_action) AS user_permissions FROM roles r
        INNER JOIN roles_permissions rp ON r.role_id = rp.rp_role_id
        INNER JOIN permissions p ON rp.rp_permission_id = p.permission_id
        WHERE r.role_name = $1
        GROUP BY r.role_id, r.role_name`,
      [role]
    )

    return rows[0]?.user_permissions ?? []
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
