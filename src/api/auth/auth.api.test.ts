import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '../client'
import { getGoogleAuthorizationLink, postGoogleAuthorizationExchange } from './auth.api'

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Google authentication API', () => {
  it('requests the Google authorization link', () => {
    getGoogleAuthorizationLink()

    expect(apiClient.get).toHaveBeenCalledWith('/auth/google/link')
  })

  it('exchanges the one-time handoff code for an app token', () => {
    postGoogleAuthorizationExchange({ code: 'handoff-code' })

    expect(apiClient.post).toHaveBeenCalledWith('/auth/google/exchange', { code: 'handoff-code' })
  })
})
