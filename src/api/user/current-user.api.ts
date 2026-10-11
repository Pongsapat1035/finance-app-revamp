import { apiClient } from '#/api/client'
import type { CurrentUser } from './current-user.type'

export const getCurrentUser = () => apiClient.get<CurrentUser>('/me')
