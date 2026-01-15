import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import { MentorCreateProps } from './mentor.model'
import { MentorService } from './mentor.service'

export class MentorController {
  static async uploadProfileController(profile: File): Promise<ApiResponse> {
    const urlProfile = await upload(profile, '/mentor')

    return ResponseHelper.success('Upload profile mentor berhasil', urlProfile)
  }

  static async addMentorController(
    payload: MentorCreateProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { mentors_id } = await MentorService.addMentor(payload, user.user_id)

    return ResponseHelper.created('Menambah mentor berhasil', mentors_id)
  }

  static async getAllMentorController(): Promise<ApiResponse> {
    const mentors = await MentorService.getAllMentor()

    return ResponseHelper.success(
      'Mengambil semua data mentor berhasil',
      mentors
    )
  }

  static async updateMentorController(
    mentorId: string,
    payload: MentorCreateProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    await MentorService.getMentorById(mentorId)
    const { mentors_name } = await MentorService.updateMentor(
      mentorId,
      payload,
      user.user_id
    )

    return ResponseHelper.success(
      `Memperbarui mentor: ${mentors_name} berhasil`
    )
  }

  static async deleteMentorController(mentorId: string): Promise<ApiResponse> {
    await MentorService.getMentorById(mentorId)
    const { mentors_name } = await MentorService.deleteMentor(mentorId)

    return ResponseHelper.success(`Menghapus mentor: ${mentors_name} berhasil`)
  }
}
