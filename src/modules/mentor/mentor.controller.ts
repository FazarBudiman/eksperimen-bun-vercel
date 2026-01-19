import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'
import { MentorCreateProps, MentorUpdateProps } from './mentor.model'
import { MentorService } from './mentor.service'

export class MentorController {
  static async addMentorController(
    payload: MentorCreateProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const urlProfile = await upload(payload.profile, '/mentor')
    const mentors_id = await MentorService.addMentor(
      payload,
      user.user_id,
      urlProfile
    )

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
    payload: MentorUpdateProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    await MentorService.getMentorById(mentorId)

    let profileUrl: string | null = null
    if (payload.profile) {
      profileUrl = await upload(payload.profile, '/mentor')
    }
    const { mentor_name } = await MentorService.updateMentor(
      mentorId,
      payload,
      profileUrl,
      user.user_id
    )

    return ResponseHelper.success(`Memperbarui mentor: ${mentor_name} berhasil`)
  }

  static async deleteMentorController(mentorId: string): Promise<ApiResponse> {
    await MentorService.getMentorById(mentorId)
    const { mentors_name } = await MentorService.deleteMentor(mentorId)

    return ResponseHelper.success(`Menghapus mentor: ${mentors_name} berhasil`)
  }
}
