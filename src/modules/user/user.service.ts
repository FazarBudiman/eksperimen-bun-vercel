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
    userWhoCreated: string,
    urlProfile: string
  ) {
    const passwordHash = bcrypt.hashSync(payload.password, 12)

    const { rows } = await supabasePool.query(
      `INSERT INTO users (
          user_id, username, password_hash, full_name, user_profile_url, user_role_id, created_by, created_date)
        VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW()) 
        RETURNING user_id`,
      [
        payload.username,
        passwordHash,
        payload.fullName,
        urlProfile,
        roleId,
        userWhoCreated,
      ]
    )
    return rows[0]
  }

  static async getRoleId(userRole: string) {
    const { rows } = await supabasePool.query(
      `SELECT role_id FROM roles WHERE role_name = $1`,
      [userRole]
    )

    return rows[0].role_id
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
                u.user_id,
                u.username,
                u.user_profile_url,
                r.role_name,
                u.is_active
            FROM users u
            JOIN roles r ON u.user_role_id = r.role_id
            WHERE is_deleted = false
            `
    )
    return { rows }
  }

  static async getUserById(userId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT user_id FROM users WHERE user_id = $1 AND is_deleted = false`,
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
      `UPDATE users SET is_deleted = true WHERE user_id = $1 RETURNING username`,
      [userId]
    )
    return rows[0]
  }
}
