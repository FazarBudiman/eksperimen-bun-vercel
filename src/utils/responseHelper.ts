// import { HttpError } from '../exceptions/Error'
import type { ApiResponse } from '../types/response.type'

export class ResponseHelper {
  /**
   * Success response
   */
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      ...(data !== undefined && { data }),
    }
  }

  /**
   * Created response (untuk POST)
   */
  static created<T>(message: string, data: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    }
  }
}
