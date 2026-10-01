import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import KeyBoard from './KeyBoard'

const guess = (letter, position) => ({ letter, position })
const pastWordsFor = (...words) =>
  words.map(w => ({ word: 3, words: w }))

const keyClass = letter =>
  screen.getByRole('button', { name: letter.toLowerCase() }).className

const renderKeyboard = pastWords =>
  render(
    <KeyBoard
      pastWords={pastWords}
      addLetter={() => {}}
      deleteLetter={() => {}}
      submitWord={() => {}}
    />
  )

describe('KeyBoard', () => {
  it('colours each key from its guess', () => {
    renderKeyboard(
      pastWordsFor([guess('A', 'in'), guess('B', 'nin'), guess('T', 'eq')])
    )

    expect(keyClass('a')).toBe('key btn in')
    expect(keyClass('b')).toBe('key btn nin')
    expect(keyClass('t')).toBe('key btn eq')
  })

  it('leaves unguessed keys without any state class', () => {
    renderKeyboard(pastWordsFor([guess('A', 'in')]))

    const z = screen.getByRole('button', { name: 'z' })
    expect(z.className).toBe('key btn')
  })

  it('never downgrades a key that has been eq', () => {
    renderKeyboard(
      pastWordsFor(
        [guess('T', 'eq'), guess('O', 'nin'), guess('P', 'nin')],
        [guess('T', 'nin'), guess('O', 'nin'), guess('P', 'nin')]
      )
    )

    expect(keyClass('t')).toBe('key btn eq')
  })

  it('lets a later guess reveal a letter as in the word', () => {
    renderKeyboard(
      pastWordsFor(
        [guess('D', 'nin'), guess('O', 'nin'), guess('G', 'nin')],
        [guess('A', 'in'), guess('C', 'eq'), guess('T', 'eq')]
      )
    )

    expect(keyClass('a')).toBe('key btn in')
  })
})
