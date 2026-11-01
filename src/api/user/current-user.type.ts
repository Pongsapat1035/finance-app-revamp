export interface CurrentUser {
  id: number
  email: string
  name: string | null
  bio: string | null
  avatarUrl: string | null
  hasPassword: boolean
  passwordChangedAt: string | null
  status: 'UNVERIFIED' | 'VERIFIED' | 'BANNED'
  createdAt: string
  updatedAt: string
}

export interface UpdateProfile {
  name?: string
  bio?: string | null
}
