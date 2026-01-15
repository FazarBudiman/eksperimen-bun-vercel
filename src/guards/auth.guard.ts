import { Role } from '../types/role.type'
import { UnauthorizedError, ForbiddenError } from '../exceptions/auth.error'
import { AccessTokenPayload } from '../types/jwt.type'
import { AuthUser } from '../types/auth.type'

export const requireAuth = (roles?: Role | Role[]) => async (ctx: any) => {
  // Authentication
  const { bearer, accessToken, store } = ctx
  if (!bearer) {
    throw new UnauthorizedError('Missing access token')
  }

  const payload = (await accessToken.verify(bearer)) as
    | AccessTokenPayload
    | false

  if (!payload) {
    throw new UnauthorizedError('Invalid or expired token')
  }

  // Authorization
  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    if (!allowedRoles.includes(payload.user_role)) {
      throw new ForbiddenError('Insufficient permissions')
    }
  }

  // Set Context for User Authenticated
  const user: AuthUser = {
    user_id: payload.user_id,
    user_role: payload.user_role,
  }

  store.user = user
}
