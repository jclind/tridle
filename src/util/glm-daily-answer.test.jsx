import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useDailyAnswer, getTridleNumber } from './useDailyAnswer'
import { answers } from '../assets/data/threeLetterWords'

// The same start instant useDailyAnswer uses, written with an explicit
// GMT offset so the tests mean the same moment in any timezone.
const START = new Date(
  'Wed Mar 30 2022 00:00:00 GMT-0400 (Eastern Daylight Time)'
)
const HOUR = 60 * 60 * 1000

// A local wall-clock time on answer-day `idx`. The suite runs in
// America/New_York (vite.config.mjs), the zone the start date is anchored to,
// so local midnight is the day boundary.
const duringAnswerDay = (idx, hour = 11, min = 0, sec = 0, ms = 0) =>
  new Date(2022, 2, 30 + idx, hour, min, sec, ms)

// Minimal harness that puts the hook's answer in the DOM
const AnswerProbe = () => {
  const answer = useDailyAnswer()
  return <div data-testid='answer'>{answer}</div>
}

const answerText = () => screen.getByTestId('answer').textContent

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDailyAnswer', () => {
  it('picks the answer for the number of days since the start date', () => {
    vi.setSystemTime(duringAnswerDay(77))
    render(<AnswerProbe />)
    expect(answerText()).toBe(answers[77].toUpperCase())
    expect(answerText()).toBe('HIS')
  })

  it('gives every mount on the same day the same answer', () => {
    vi.setSystemTime(duringAnswerDay(10))
    const { unmount } = render(<AnswerProbe />)
    const first = answerText()
    unmount()
    render(<AnswerProbe />)
    expect(answerText()).toBe(first)
    expect(answerText()).toBe(answers[10].toUpperCase())
  })

  it('wraps back to the first answer once every answer has been used', () => {
    vi.setSystemTime(duringAnswerDay(427))
    const { unmount } = render(<AnswerProbe />)
    expect(answerText()).toBe(answers[0].toUpperCase())
    unmount()

    vi.setSystemTime(duringAnswerDay(428))
    render(<AnswerProbe />)
    expect(answerText()).toBe(answers[1].toUpperCase())
  })

  it('always answers with an uppercase word', () => {
    vi.setSystemTime(duringAnswerDay(399))
    render(<AnswerProbe />)
    expect(answerText()).toBe('CAT')
  })

  it('swaps in the next answer exactly at local midnight', () => {
    vi.setSystemTime(duringAnswerDay(77, 23, 0))
    render(<AnswerProbe />)
    expect(answerText()).toBe('HIS')

    // The hook schedules a timeout for the next local midnight.
    act(() => {
      vi.advanceTimersByTime(HOUR - 1)
    })
    expect(answerText()).toBe('HIS')
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(answerText()).toBe(answers[78].toUpperCase())
    expect(answerText()).toBe('BOT')
  })
})

describe('getTridleNumber', () => {
  it('is 0 at the exact start instant', () => {
    vi.setSystemTime(START)
    expect(getTridleNumber()).toBe(0)
  })

  // The shared number has to name the same puzzle as the answer all day.
  it.each([
    [0, 0],
    [11, 0],
    [12, 30],
    [13, 0],
    [23, 59],
  ])('stays on the answer\'s day at %i:%i', (hour, min) => {
    vi.setSystemTime(duringAnswerDay(3, hour, min))
    expect(getTridleNumber()).toBe(3)
  })

  it('names the same day across a DST change', () => {
    // 2022-11-06 is a 25-hour day in New York.
    const idx = 221 // 2022-11-06
    vi.setSystemTime(duringAnswerDay(idx, 23, 0))
    expect(getTridleNumber()).toBe(idx)
  })
})
