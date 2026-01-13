// import { supabase } from "../../db/supabase";
import { pool } from "../../supabase/pool";
import { MessageCreateProps } from "./messages.model";

export class MessageService {
    static async fetchMessages() {
        const { rows } = await pool.query(
            `SELECT * FROM messages`
        )
        return rows
    }

    static async addMessage(payload: MessageCreateProps){
        return {
            messageId: 'message-242424',
            senderName: payload.senderName,
            senderEmail: payload.senderEmail,
            messageBody: payload.messageBody
        }
    }
}