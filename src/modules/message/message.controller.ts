import { MessageService } from './message.service'
import { MessageCreateProps, MessageUpdateProps } from './message.model'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { ResponseHelper } from '../../utils/responseHelper'

export class MessageController {
  static async addMessageController(
    payload: MessageCreateProps
  ): Promise<ApiResponse> {
    const messageId = await MessageService.addMessage(payload)
    return ResponseHelper.created('Membuat pesan berhasil', messageId)
  }

  static async getAllMessageController(): Promise<ApiResponse> {
    const data = await MessageService.getAllMessage()
    return ResponseHelper.success('Mengambil semua data pesan berhasil', data)
  }

  static async updateMessageController(
    payload: MessageUpdateProps,
    messageId: string,
    userWhoUpdated: AuthUser
  ): Promise<ApiResponse> {
    await MessageService.getMessageById(messageId)
    const message = await MessageService.updateMessageById(
      payload,
      messageId,
      userWhoUpdated.user_id
    )
    return ResponseHelper.success(
      `Memperbarui status pesan dari ${message.sender_name} berhasil`
    )
  }

  static async deleteMessageController(
    messageId: string
  ): Promise<ApiResponse> {
    await MessageService.getMessageById(messageId)
    const deleted = await MessageService.deleteMessageById(messageId)

    return ResponseHelper.success(
      `Menghapus pesan dari ${deleted.sender_name} berhasil`
    )
  }
}
