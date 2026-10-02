import { describe, it, expect, vi, afterEach } from 'vitest'
import { setLocalStorage, setUserGameStats } from './setLocalStorage'

const HOUR = 60 * 60 * 1000

afterEach(() => {
  vi.useRealTimers()
})

const zeroGuesses = () => ({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 })

const readStats = () =>
  JSON.parse(localStorage.getItem('user-game-stats'))
const readGame = () => JSON.parse(localStorage.getItem('current-game'))

const seedStats = overrides =>
  localStorage.setItem(
    'user-game-stats',
    JSON.stringify({
      totalGames: 1,
      guesses: zeroGuesses(),
      gamesWon: 0,
      gamesLost: 1,
      winStreak: 0,
      maxWinStreak: 0,
      lastUpdated: Date.now() - 49 * HOUR,
      ...overrides,
    })
  )

describe('setLocalStorage', () => {
  it('saves the whole game state under current-game', () => {
    const pastWords = [
      { word: 3, words: [{ letter: 'C', position: 'in' }] },
    ]
    setLocalStorage('IN_PROGRESS', 2, pastWords, 'CAT')

    expect(readGame()).toEqual({
      gameStatus: 'IN_PROGRESS',
      selectedRow: 2,
      pastWords,
      solution: 'CAT',
    })
  })

  it('replaces whatever game was saved before', () => {
    setLocalStorage('IN_PROGRESS', 1, [], 'DOG')
    setLocalStorage('WON', 3, [{ word: 3, words: [] }], 'CAT')

    expect(readGame().solution).toBe('CAT')
    expect(readGame().gameStatus).toBe('WON')
  })
})

describe('setUserGameStats', () => {
  it('creates a won game from nothing', () => {
    setUserGameStats('WON', 3)

    expect(readStats()).toEqual({
      totalGames: 1,
      guesses: { ...zeroGuesses(), 3: 1 },
      gamesWon: 1,
      gamesLost: 0,
      winStreak: 1,
      maxWinStreak: 1,
      lastUpdated: expect.any(Number),
    })
  })

  it('creates a lost game from nothing with an empty guess chart', () => {
    setUserGameStats('LOST')

    expect(readStats()).toEqual({
      totalGames: 1,
      guesses: zeroGuesses(),
      gamesWon: 0,
      gamesLost: 1,
      winStreak: 0,
      maxWinStreak: 0,
      lastUpdated: expect.any(Number),
    })
  })

  it('adds a win the same day or the day after to the streak', () => {
    // Last game finished two hours ago: still "today or yesterday"
    seedStats({
      guesses: { ...zeroGuesses(), 3: 1 },
      gamesWon: 1,
      gamesLost: 0,
      winStreak: 1,
      maxWinStreak: 1,
      lastUpdated: Date.now() - 2 * HOUR,
    })

    setUserGameStats('WON', 5)

    const stats = readStats()
    expect(stats.totalGames).toBe(2)
    expect(stats.gamesWon).toBe(2)
    expect(stats.gamesLost).toBe(0)
    expect(stats.winStreak).toBe(2)
    expect(stats.maxWinStreak).toBe(2)
    expect(stats.guesses).toEqual({ ...zeroGuesses(), 3: 1, 5: 1 })
  })

  it('also counts a streak when the last game was 24 hours ago', () => {
    // A fixed noon, so a DST change can't put "24 hours ago" before
    // yesterday's midnight.
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(2026, 5, 15, 12))
    seedStats({
      gamesWon: 1,
      winStreak: 1,
      maxWinStreak: 1,
      lastUpdated: Date.now() - 24 * HOUR,
    })

    setUserGameStats('WON', 2)

    expect(readStats().winStreak).toBe(2)
  })

  it('resets the streak on a loss but keeps the best streak', () => {
    seedStats({
      totalGames: 4,
      gamesWon: 3,
      gamesLost: 1,
      winStreak: 3,
      maxWinStreak: 5,
      lastUpdated: Date.now() - 2 * HOUR,
    })

    setUserGameStats('LOST')

    const stats = readStats()
    expect(stats.totalGames).toBe(5)
    expect(stats.gamesWon).toBe(3)
    expect(stats.gamesLost).toBe(2)
    expect(stats.winStreak).toBe(0)
    expect(stats.maxWinStreak).toBe(5)
  })

  it('keeps every guess bucket when recording a new win', () => {
    seedStats({
      guesses: { ...zeroGuesses(), 1: 2, 8: 1 },
      gamesWon: 3,
      winStreak: 3,
      maxWinStreak: 3,
      lastUpdated: Date.now() - 2 * HOUR,
    })

    setUserGameStats('WON', 8)

    expect(readStats().guesses).toEqual({ ...zeroGuesses(), 1: 2, 8: 2 })
  })
})
