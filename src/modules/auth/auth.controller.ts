import { BadRequest } from '../../exceptions/client.error'
import { AccessTokenPayload } from '../../plugins/jwt/token.schema'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import { RefreshTokenProps, SignInProps } from './auth.model'
import { AuthService } from './auth.service'

export class AuthController {
  static async signInController(
    payload: SignInProps,
    accessToken: {
      sign: (payload: AccessTokenPayload) => Promise<string>
    },
    refreshToken: {
      sign: (payload: { user_id: string }) => Promise<string>
    }
  ): Promise<ApiResponse> {
    const user = await AuthService.verifyUserCredential(payload)

    const permission = await AuthService.getUserPermissions(user.role_name)

    const access_token = await accessToken.sign({
      user_id: user.user_id,
      user_role: user.role_name,
      user_permissions: permission,
    })

    const refresh_token = await refreshToken.sign({
      user_id: user.user_id,
    })

    await AuthService.saveRefreshToken(refresh_token)

    return ResponseHelper.success('Sign in berhasil', {
      access_token,
      refresh_token,
    })
  }

  static async refreshController(
    payload: RefreshTokenProps,
    accessToken: {
      sign: (payload: AccessTokenPayload) => Promise<string>
    },
    refreshToken: {
      verify: (token?: string) => Promise<any>
    }
  ): Promise<ApiResponse> {
    const { refresh_token } = payload

    // 1. Verify refresh token JWT
    const decoded = await refreshToken.verify(refresh_token)
    if (!decoded) {
      throw new BadRequest('Invalid refresh token')
    }

    // 2. Check refresh token exists in DB
    await AuthService.verifyRefreshTokenExist(refresh_token)

    // 3. Issue new access token (reuse claims)
    const newAccessToken = await accessToken.sign({
      user_id: decoded.user_id,
      user_role: decoded.user_role,
      user_permissions: decoded.user_permissions,
    })

    return ResponseHelper.success('Memperbarui access token berhasil', {
      access_token: newAccessToken,
    })
  }

  static async signOutController(
    payload: RefreshTokenProps
  ): Promise<ApiResponse> {
    const { refresh_token } = payload
    await AuthService.verifyRefreshTokenExist(refresh_token)

    await AuthService.deleteRefreshToken(refresh_token)

    return ResponseHelper.success('Sign out berhasil')
  }
}
