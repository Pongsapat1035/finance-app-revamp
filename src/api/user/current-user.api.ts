import { apiClient } from '#/api/client'
import type { CurrentUser, UpdateProfile } from './current-user.type'

export const getCurrentUser = () => apiClient.get<CurrentUser>('/me')
export const updateProfile = (payload: UpdateProfile) =>
  apiClient.patch<CurrentUser>('/me', payload)
export const getAvatar = () => apiClient.get<Blob>('/me/avatar', { responseType: 'blob' })
export const uploadAvatar = (file: File) => {
  const data = new FormData()
  data.append('file', file)
  return apiClient.put<CurrentUser>('/me/avatar', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
export const deleteAvatar = () => apiClient.delete<void>('/me/avatar')
export const deleteAccount = () => apiClient.delete<void>('/me')
