import { describe, expect, it } from 'vitest'
import { formatNumber } from './format'

describe('number formatting', () => {
  it('groups large values and preserves decimals where needed', () => {
    expect(formatNumber(10000)).toBe('10,000')
    expect(formatNumber(12345.67)).toBe('12,345.67')
    expect(formatNumber(12345.6789)).toBe('12,345.6789')
    expect(formatNumber(-12345.6)).toBe('-12,345.6')
  })
})
