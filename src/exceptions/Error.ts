export class HttpError extends Error {
  constructor(
    public status: number,
    public success: boolean,
    public code: string,
    message: string
  ) {
    super(message)
  }
}
