import { isAxiosError } from 'axios'

interface ApiErrorResponse {
  message?: string | string[]
}

export interface HandledError {
  message: string
  statusCode: number | null
}

export function handleAxiosError(error: unknown): HandledError {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    console.log(error)
    return { message: 'error occure', statusCode: null }
  }
  const statusCode = error.response?.status ?? null
  const raw = error.response?.data?.message
  const message = Array.isArray(raw) ? raw.join(', ') : (raw ?? error.message)
  console.log({ message, statusCode })
  return { message, statusCode }
}
