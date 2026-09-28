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

// An instant 11 hours into answer-day `idx`. useDailyAnswer truncates the
// current time to local midnight before counting days, so picking a point
// 11 hours past the boundary keeps the rounded day count equal to `idx`
// no matter what timezone the tests run in.
const duringAnswerDay = idx =>
  new Date(START.getTime() + (idx * 24 + 11) * HOUR)

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

  it('swaps in the next answer after local midnight', () => {
    vi.setSystemTime(duringAnswerDay(77))
    render(<AnswerProbe />)
    expect(answerText()).toBe('HIS')

    // The hook schedules a timeout at the next local midnight. Advancing
    // a full 25 hours fires it and recomputes the answer for the new day.
    act(() => {
      vi.advanceTimersByTime(25 * HOUR)
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

  it('counts the days since the start date', () => {
    vi.setSystemTime(duringAnswerDay(3))
    expect(getTridleNumber()).toBe(3)
  })
})
