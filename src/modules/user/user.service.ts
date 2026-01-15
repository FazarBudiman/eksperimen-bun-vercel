import {
  BadRequest,
  ResourceNotFoundError,
} from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { UserCreateProps } from './user.model'
import * as bcrypt from 'bcrypt'

export class UserService {
  static async addUser(
    payload: UserCreateProps,
    roleId: string,
    userWhoCreated: string
  ) {
    const passwordHash = bcrypt.hashSync(payload.password, 12)

    const { rows } = await supabasePool.query(
      `INSERT INTO users (
          users_id, username, password_hash, url_profile, users_role_id, created_by, created_date)
        VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, NOW()) 
        RETURNING users_id`,
      [
        payload.username,
        passwordHash,
        payload.urlProfile,
        roleId,
        userWhoCreated,
      ]
    )
    return rows[0]
  }

  static async getRoleId(userRole: string) {
    const { rows } = await supabasePool.query(
      `SELECT roles_id FROM roles WHERE roles_name = $1`,
      [userRole]
    )

    return rows[0].roles_id
  }

  static async verifyUsernameIsExisting(username: string): Promise<boolean> {
    const { rows } = await supabasePool.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    )

    if (rows.length > 0) {
      throw new BadRequest('Username already exists')
    } else {
      return true
    }
  }

  static async getUsers() {
    const { rows } = await supabasePool.query(
      `SELECT 
                u.users_id,
                u.username,
                u.url_profile,
                r.roles_name,
                u.is_active
            FROM users u
            JOIN roles r ON u.users_role_id = r.roles_id
            WHERE is_deleted = false
            `
    )
    return { rows }
  }

  static async getUserById(userId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT users_id FROM users WHERE users_id = $1 AND is_deleted = false`,
        [userId]
      )
    } catch {
      throw new BadRequest('Invalid user ID format')
    }

    if (result.rows.length < 1) {
      throw new ResourceNotFoundError('User not found')
    }

    return result.rows[0]
  }

  static async deleteUserById(userId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE users SET is_deleted = true WHERE users_id = $1 RETURNING username`,
      [userId]
    )
    return rows[0]
  }
}
