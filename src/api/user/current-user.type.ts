export interface CurrentUser {
  id: number
  email: string
  name: string | null
  status: 'UNVERIFIED' | 'VERIFIED' | 'BANNED'
  createdAt: string
  updatedAt: string
}
