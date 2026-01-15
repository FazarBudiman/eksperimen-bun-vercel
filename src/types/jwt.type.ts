import { Role } from './role.type'

export interface AccessTokenPayload {
  user_id: string
  user_role: Role
  iat?: number
  exp?: number
}
