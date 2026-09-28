import { describe, it, expect } from 'vitest'
import diffDays from './diffDays'

const DAY = 24 * 60 * 60 * 1000

describe('diffDays', () => {
  it('returns 0 for the same moment', () => {
    const d = new Date(2022, 5, 15, 9, 30)
    expect(diffDays(d, d)).toBe(0)
  })

  it('returns 1 for the same clock time one day apart', () => {
    const a = new Date(Date.UTC(2022, 2, 30, 12))
    const b = new Date(a.getTime() + DAY)
    expect(diffDays(a, b)).toBe(1)
  })

  it('counts the whole days in a longer span', () => {
    const a = new Date(Date.UTC(2022, 2, 30, 12))
    const b = new Date(Date.UTC(2022, 3, 29, 12)) // 30 days later
    expect(diffDays(a, b)).toBe(30)
  })

  it('gives the same result for either argument order', () => {
    const a = new Date(Date.UTC(2022, 2, 30, 12))
    const b = new Date(Date.UTC(2022, 3, 2, 12))
    expect(diffDays(b, a)).toBe(3)
    expect(diffDays(b, a)).toBe(diffDays(a, b))
  })

  it('rounds to the nearest day instead of truncating', () => {
    // 36 hours is 1.5 days: rounds to 2, a floor would give 1
    const a = new Date(Date.UTC(2022, 2, 30, 0))
    const b = new Date(Date.UTC(2022, 2, 31, 12))
    expect(diffDays(a, b)).toBe(2)
  })

  it('treats a gap of less than half a day as the same day', () => {
    const a = new Date(Date.UTC(2022, 2, 30, 0))
    const b = new Date(Date.UTC(2022, 2, 30, 11))
    expect(diffDays(a, b)).toBe(0)
  })
})
