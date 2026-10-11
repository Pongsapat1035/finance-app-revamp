import { describe, expect, it, vi } from 'vitest'

import { apiClient } from '#/api/client'
import { getCurrentUser } from './current-user.api'

vi.mock('#/api/client', () => ({
  apiClient: { get: vi.fn() },
}))

describe('current user API', () => {
  it('requests the authenticated user from the unprefixed /me route', () => {
    getCurrentUser()

    expect(apiClient.get).toHaveBeenCalledWith('/me')
  })
})
