import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import { UserCreateProps } from './user.model'
import { UserService } from './user.service'

export class UserController {
  static async addUserController(
    payload: UserCreateProps,
    userWhoCreated: AuthUser
  ): Promise<ApiResponse> {
    await UserService.verifyUsernameIsExisting(payload.username)

    const roleId = await UserService.getRoleId(payload.userRole)
    const user = await UserService.addUser(
      payload,
      roleId,
      userWhoCreated.user_id
    )

    return ResponseHelper.created('Menambah user berhasil', user)
  }

  static async getAllUserController(): Promise<ApiResponse> {
    const { rows } = await UserService.getUsers()
    return ResponseHelper.success('Mengambil semua data user berhasil', rows)
  }

  static async deleteUserController(userId: string): Promise<ApiResponse> {
    await UserService.getUserById(userId)
    const { username } = await UserService.deleteUserById(userId)

    return ResponseHelper.success(`Menghapus user: ${username} berhasil`)
  }
}
