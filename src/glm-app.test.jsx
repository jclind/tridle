import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import App from './App'
import { answers } from './assets/data/threeLetterWords'

vi.mock('./client/analytics', () => ({ logGameEvent: vi.fn() }))
vi.mock('./client/firebase', () => ({ app: {}, db: {}, analytics: {} }))

const START = new Date(
  'Wed Mar 30 2022 00:00:00 GMT-0400 (Eastern Daylight Time)'
)
const HOUR = 60 * 60 * 1000

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  const idx = answers.indexOf('cat')
  vi.setSystemTime(new Date(START.getTime() + (idx * 24 + 11) * HOUR))
  localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
})

const appClass = container => container.querySelector('.app').className
const readSettings = () => JSON.parse(localStorage.getItem('settings'))

describe('App', () => {
  it('defaults to the dark theme and saves that default', () => {
    const { container } = render(<App />)

    expect(appClass(container)).toContain('dark-theme')
    expect(appClass(container)).not.toContain('color-blind')
    expect(readSettings()).toEqual({ isDark: true, isColorBlind: false })
  })

  it('applies the saved settings', () => {
    localStorage.setItem(
      'settings',
      JSON.stringify({ isDark: false, isColorBlind: true })
    )
    const { container } = render(<App />)

    expect(appClass(container)).not.toContain('dark-theme')
    expect(appClass(container)).toContain('color-blind')
  })

  it('switches theme from the navbar and persists it', () => {
    const { container } = render(<App />)

    act(() => {
      fireEvent.click(container.querySelector('.light-dark-toggle-btn'))
    })

    expect(appClass(container)).not.toContain('dark-theme')
    expect(readSettings().isDark).toBe(false)
  })

  it('opens the info modal from the navbar and closes it again', () => {
    const { container } = render(<App />)

    act(() => {
      fireEvent.click(container.querySelector('.nav-btn.info'))
    })
    expect(
      document.body.textContent
    ).toContain('A new Tridle will be available every day!')

    act(() => {
      fireEvent.click(document.body.querySelector('.info-modal .close-modal-btn'))
    })
    expect(document.body.textContent).not.toContain(
      'A new Tridle will be available every day!'
    )
  })

  it('opens the stats modal from the navbar', () => {
    const { container } = render(<App />)

    act(() => {
      fireEvent.click(container.querySelector('.nav-btn.stats'))
    })

    expect(document.body.textContent).toContain('Tridle Statistics')
    expect(document.body.querySelector('.games-played .num').textContent).toBe(
      '0'
    )
  })
})
