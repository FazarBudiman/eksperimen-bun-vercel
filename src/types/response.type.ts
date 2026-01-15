export type ApiResponse<T = any> = {
  success: boolean
  message: string
  data?: T
  errors?: Record<string, string>
  code?: string // Optional: untuk error codes
}
