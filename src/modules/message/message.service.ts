import {
  BadRequest,
  ResourceNotFoundError,
} from '../../exceptions/client.error'
import { supabasePool } from '../../supabase/supabasePool'
import { MessageCreateProps, MessageUpdateProps } from './message.model'

export class MessageService {
  static async addMessage(payload: MessageCreateProps) {
    const {
      senderName,
      senderEmail,
      organizationName,
      senderPhone,
      subject,
      messageBody,
    } = payload
    const { rows } = await supabasePool.query(
      `INSERT INTO messages(
          sender_name, sender_email, organization_name, sender_phone, subject, message_body, message_status, created_date)
        VALUES ($1, $2, $3, $4, $5, $6, 'NEW', NOW()) 
        RETURNING message_id`,
      [
        senderName,
        senderEmail,
        organizationName,
        senderPhone,
        subject,
        messageBody,
      ]
    )
    return rows[0]
  }

  static async getAllMessage() {
    const { rows } = await supabasePool.query(
      `SELECT message_id, sender_name, sender_email, sender_phone, organization_name, message_status, subject, message_body, created_date AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Jakarta' AS created_date
          FROM messages 
          WHERE is_deleted = false 
          ORDER BY created_date DESC`
    )
    return rows
  }

  static async getMessageById(messageId: string) {
    let result
    try {
      result = await supabasePool.query(
        `SELECT message_id FROM messages WHERE message_id = $1 AND is_deleted = false`,
        [messageId]
      )
    } catch {
      throw new BadRequest('Invalid message ID format')
    }

    if (result.rows.length < 1) {
      throw new ResourceNotFoundError('Message not found')
    }
    return result.rows[0]
  }

  static async updateMessageById(
    payload: MessageUpdateProps,
    messageId: string,
    userWhoUpdated: string
  ) {
    const { rows } = await supabasePool.query(
      `UPDATE messages 
        SET message_status = $1, updated_by = $2, updated_date = NOW() 
        WHERE message_id = $3 
        RETURNING sender_name`,
      [payload.status, userWhoUpdated, messageId]
    )
    return rows[0]
  }

  static async deleteMessageById(messageId: string) {
    const { rows } = await supabasePool.query(
      `UPDATE messages SET is_deleted = true WHERE message_id = $1 RETURNING sender_name`,
      [messageId]
    )

    return rows[0]
  }
}
