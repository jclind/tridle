import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act, screen } from '@testing-library/react'
import Tridle from './Tridle'
import { threeLetterWords, answers } from '../../assets/data/threeLetterWords'
import { logGameEvent } from '../../client/analytics'

vi.mock('../../client/analytics', () => ({ logGameEvent: vi.fn() }))
vi.mock('../../client/firebase', () => ({
  app: {},
  db: {},
  analytics: {},
}))

const START = new Date(
  'Wed Mar 30 2022 00:00:00 GMT-0400 (Eastern Daylight Time)'
)
const HOUR = 60 * 60 * 1000

// Same trick as the useDailyAnswer tests: 11 hours into the answer's day
// makes local-midnight truncation timezone proof.
const pinAnswer = word => {
  const idx = answers.indexOf(word.toLowerCase())
  if (idx === -1) throw new Error(word + ' is not in the answers list')
  vi.setSystemTime(new Date(START.getTime() + (idx * 24 + 11) * HOUR))
}

const pressKey = key =>
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }))
  })
const typeWord = word =>
  act(() => {
    word
      .split('')
      .forEach(letter =>
        window.dispatchEvent(new KeyboardEvent('keydown', { key: letter }))
      )
  })
const submit = () => pressKey('Enter')

const rows = container => [...container.querySelectorAll('.tridle-row')]
const tiles = rowEl => [...rowEl.querySelectorAll('.tridle-tile')]
const tileClasses = rowEl => tiles(rowEl).map(t => t.className)
const tileLetters = rowEl => tiles(rowEl).map(t => t.textContent)
const readGame = () => JSON.parse(localStorage.getItem('current-game'))
const readStats = () => JSON.parse(localStorage.getItem('user-game-stats'))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  localStorage.clear()
  logGameEvent.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('guess checking and letter colouring', () => {
  it('marks letters missing from the answer nin', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    typeWord('dog')
    submit()

    expect(tileLetters(rows(container)[0])).toEqual(['D', 'O', 'G'])
    expect(tileClasses(rows(container)[0])).toEqual([
      'nin tridle-tile',
      'nin tridle-tile',
      'nin tridle-tile',
    ])
  })

  it('marks a letter in the wrong place in and a letter in place eq', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    typeWord('act')
    submit()

    expect(tileClasses(rows(container)[0])).toEqual([
      'in tridle-tile',
      'in tridle-tile',
      'eq tridle-tile',
    ])
  })

  it('marks a repeated guess letter in only once when the answer holds one', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    typeWord('aha')
    submit()

    // First A is somewhere else in CAT, the second A is spent
    expect(tileClasses(rows(container)[0])).toEqual([
      'in tridle-tile',
      'nin tridle-tile',
      'nin tridle-tile',
    ])
  })

  it('yellows an unplaced copy when the answer has the letter twice', () => {
    pinAnswer('DID')
    const { container } = render(<Tridle />)

    typeWord('add')
    submit()

    // DID has two Ds; one is already eq at the end, the guess's middle D
    // is still in the answer
    expect(tileClasses(rows(container)[0])).toEqual([
      'nin tridle-tile',
      'in tridle-tile',
      'eq tridle-tile',
    ])
  })
})

describe('winning', () => {
  it('solves the puzzle, records the win and blocks further input', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    typeWord('cat')
    submit()

    expect(tileClasses(rows(container)[0])).toEqual([
      'eq tridle-tile',
      'eq tridle-tile',
      'eq tridle-tile',
    ])
    expect(screen.getByText('Puzzle Solved!')).toBeTruthy()
    expect(
      screen.getByText('Congrats, you completed the Tridle in 1 guess!')
    ).toBeTruthy()

    const game = readGame()
    expect(game.gameStatus).toBe('WON')
    expect(game.selectedRow).toBe(1)
    expect(game.solution).toBe('CAT')

    const stats = readStats()
    expect(stats.totalGames).toBe(1)
    expect(stats.gamesWon).toBe(1)
    expect(stats.guesses['1']).toBe(1)

    expect(logGameEvent).toHaveBeenCalledWith('WON', 1)

    // Typing after the win fills nothing
    typeWord('dog')
    expect(tileLetters(rows(container)[1])).toEqual(['', '', ''])
  })
})

describe('losing', () => {
  it('uses up all eight guesses, then reveals the answer', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    // Eight dictionary words with no C, A or T anywhere
    const wrongGuesses = ['dog', 'bed', 'fig', 'him', 'jug', 'key', 'log', 'web']
    wrongGuesses.forEach(word => {
      typeWord(word)
      submit()
    })

    expect(
      rows(container).every(row =>
        tileClasses(row).every(c => c.startsWith('nin'))
      )
    ).toBe(true)
    expect(screen.getByText("You'll get 'em next time!")).toBeTruthy()
    expect(screen.getByText('CAT')).toBeTruthy()

    const game = readGame()
    expect(game.gameStatus).toBe('LOST')
    expect(game.selectedRow).toBe(8)
    expect(game.pastWords).toHaveLength(8)

    const stats = readStats()
    expect(stats.gamesLost).toBe(1)
    expect(stats.gamesWon).toBe(0)

    expect(logGameEvent).toHaveBeenCalledWith('LOST', 8)
  })
})

describe('input rules', () => {
  it('rejects a word that is not in the dictionary', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    typeWord('qqq')
    // While the full invalid word sits in the row, the row is flagged
    expect(rows(container)[0].className).toBe('tridle-row invalid')

    submit()

    expect(tileLetters(rows(container)[0])).toEqual(['', '', ''])
    expect(rows(container)[0].className).toBe('tridle-row')
    expect(readGame().selectedRow).toBe(0)
    expect(readGame().pastWords).toEqual([])
  })

  it('ignores Enter when the word is too short', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    typeWord('ca')
    submit()

    expect(tileLetters(rows(container)[0])).toEqual(['C', 'A', ''])
    expect(readGame().selectedRow).toBe(0)
  })

  it('deletes the last letter on Backspace', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    typeWord('ca')
    pressKey('Backspace')

    expect(tileLetters(rows(container)[0])).toEqual(['C', '', ''])
  })

  it('ignores digits, punctuation and control combos', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    pressKey('1')
    pressKey('!')
    pressKey('Tab')
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      )
    })

    expect(tileLetters(rows(container)[0])).toEqual(['', '', ''])
  })

  it('accepts letters typed on the on-screen keyboard', () => {
    pinAnswer('CAT')
    const { container } = render(<Tridle />)

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'c' }))
      fireEvent.click(screen.getByRole('button', { name: 'a' }))
      fireEvent.click(screen.getByRole('button', { name: 't' }))
    })
    act(() => {
      fireEvent.click(container.querySelector('.key.enter'))
    })

    expect(screen.getByText('Puzzle Solved!')).toBeTruthy()
  })
})

describe('keyboard colours', () => {
  it('shows each guessed letter in its best state', () => {
    pinAnswer('CAT')
    render(<Tridle />)

    typeWord('act')
    submit()

    expect(screen.getByRole('button', { name: 't' }).className).toBe(
      'key btn eq'
    )
    expect(screen.getByRole('button', { name: 'a' }).className).toBe(
      'key btn in'
    )
    expect(screen.getByRole('button', { name: 'c' }).className).toBe(
      'key btn in'
    )
  })
})

describe('saved games', () => {
  it('restores an unfinished game for the same answer', () => {
    pinAnswer('CAT')
    localStorage.setItem(
      'current-game',
      JSON.stringify({
        gameStatus: 'IN_PROGRESS',
        selectedRow: 2,
        pastWords: [
          {
            word: 3,
            words: [
              { letter: 'A', position: 'in' },
              { letter: 'C', position: 'in' },
              { letter: 'T', position: 'eq' },
            ],
          },
        ],
        solution: 'CAT',
      })
    )
    const { container } = render(<Tridle />)

    expect(tileLetters(rows(container)[0])).toEqual(['A', 'C', 'T'])
    expect(tileClasses(rows(container)[0])).toEqual([
      'in tridle-tile',
      'in tridle-tile',
      'eq tridle-tile',
    ])

    // The restored game plays on from row 2
    typeWord('be')
    expect(tileLetters(rows(container)[2])).toEqual(['B', 'E', ''])
    expect(tileLetters(rows(container)[1])).toEqual(['', '', ''])
  })

  it('starts over when the saved answer was for a different day', () => {
    pinAnswer('CAT')
    localStorage.setItem(
      'current-game',
      JSON.stringify({
        gameStatus: 'WON',
        selectedRow: 5,
        pastWords: [
          {
            word: 3,
            words: [
              { letter: 'D', position: 'nin' },
              { letter: 'O', position: 'nin' },
              { letter: 'G', position: 'nin' },
            ],
          },
        ],
        solution: 'DOG',
      })
    )
    const { container } = render(<Tridle />)

    const game = readGame()
    expect(game.solution).toBe('CAT')
    expect(game.gameStatus).toBe('IN_PROGRESS')
    expect(game.selectedRow).toBe(0)
    expect(game.pastWords).toEqual([])

    rows(container).forEach(row =>
      expect(tileLetters(row)).toEqual(['', '', ''])
    )

    // A finished old game does not lock the fresh one
    typeWord('do')
    expect(tileLetters(rows(container)[0])).toEqual(['D', 'O', ''])
  })

  it('saves each guess as the game goes', () => {
    pinAnswer('CAT')
    render(<Tridle />)

    typeWord('dog')
    submit()

    const game = readGame()
    expect(game.gameStatus).toBe('IN_PROGRESS')
    expect(game.selectedRow).toBe(1)
    expect(game.pastWords).toHaveLength(1)
    expect(game.pastWords[0].words).toEqual([
      { letter: 'D', position: 'nin' },
      { letter: 'O', position: 'nin' },
      { letter: 'G', position: 'nin' },
    ])
  })
})

// Guards the dictionary the whole game depends on
describe('word list sanity', () => {
  it('only scores guesses that are complete dictionary words', () => {
    expect(threeLetterWords).toContain('cat')
    expect(threeLetterWords).not.toContain('qqq')
  })
})
