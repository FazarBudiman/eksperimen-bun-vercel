import {
  BadRequest,
  ResourceNotFoundError,
} from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import * as bcrypt from 'bcrypt'
import { UserProps } from './user.model'

export class UserService {
  static async addUser(
    payload: UserProps,
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
      `SELECT 1 FROM users WHERE username = $1`,
      [username]
    )

    if (rows.length === 1) {
      throw new BadRequest('Username already exists')
    }
    return rows[0]
  }

  static async getUsers() {
    const { rows } = await supabasePool.query(
      `SELECT 
        u.user_id, u.username, u.full_name,
        u.user_profile_url, r.role_name
      FROM users u
        JOIN roles r ON u.user_role_id = r.role_id
      WHERE is_deleted = false`
    )
    return { rows }
  }

  static async verifyUserIsExistById(userId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 1 FROM users WHERE user_id = $1 AND is_deleted = FALSE`,
      [userId]
    )
    if (rows.length === 0) {
      throw new ResourceNotFoundError('Resource user tidak ditemukan')
    }
  }

  static async getUserById(userId: string) {
    const { rows } = await supabasePool.query(
      `SELECT 
        u.user_id, u.full_name, u.username,
        u.user_profile_url, r.role_name
      FROM users u
        JOIN roles r ON u.user_role_id = r.role_id
      WHERE user_id = $1 AND is_deleted = FALSE`,
      [userId]
    )

    return rows[0]
  }

  static async deleteUserById(userId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE users SET is_deleted = true WHERE user_id = $1 RETURNING username`,
      [userId]
    )
    return rows[0]
  }
}
