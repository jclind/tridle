import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import EndGameModal from './EndGameModal'

// react-modal renders through a portal on document.body, so the
// assertions below read from the body rather than the render container.
const writeText = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  writeText.mockClear()
  Object.defineProperty(window.navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
    writable: true,
  })
})

const pastWords = [
  {
    word: 3,
    words: [
      { letter: 'C', position: 'eq' },
      { letter: 'A', position: 'in' },
      { letter: 'T', position: 'nin' },
    ],
  },
  {
    word: 3,
    words: [
      { letter: 'C', position: 'eq' },
      { letter: 'A', position: 'in' },
      { letter: 'T', position: 'eq' },
    ],
  },
]

const renderModal = props =>
  render(
    <EndGameModal
      gameOverModal={true}
      setGameOverModal={() => {}}
      gameStatus='WON'
      selectedRow={3}
      answer='CAT'
      tridleNumber={412}
      pastWords={[]}
      {...props}
    />
  )

describe('EndGameModal', () => {
  it('celebrates a win with the guess count', () => {
    renderModal({ selectedRow: 3, pastWords })

    expect(document.body.textContent).toContain(
      'Congrats, you completed the Tridle in 3 guesses!'
    )
  })

  it('says guess, not guesses, after a first-try win', () => {
    renderModal({ selectedRow: 1 })

    expect(document.body.textContent).toContain(
      'Congrats, you completed the Tridle in 1 guess!'
    )
    expect(document.body.textContent).not.toContain('guesses')
  })

  it('reveals the answer after a loss', () => {
    renderModal({ gameStatus: 'LOST', answer: 'CAT', pastWords })

    expect(document.body.textContent).toContain("You'll get 'em next time!")
    expect(document.body.querySelector('.word').textContent).toBe('CAT')
  })

  it('copies the emoji scorecard to the clipboard', () => {
    renderModal({ tridleNumber: 412, pastWords })

    fireEvent.click(document.body.querySelector('button.copy'))

    expect(writeText).toHaveBeenCalledTimes(1)
    // Blank line after the header: the header template ends in \n and each
    // row starts with its own \n
    expect(writeText).toHaveBeenCalledWith(
      'Tridle #412\n\n🟩🟨⬛️\n🟩🟨🟩\n\nhttps://tridle.netlify.app/'
    )
    expect(document.body.textContent).toContain('Copied To Clipboard')
  })

  it('builds a grey row for a fully wrong guess', () => {
    renderModal({
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
    })

    fireEvent.click(document.body.querySelector('button.copy'))

    expect(writeText).toHaveBeenCalledWith(
      'Tridle #412\n\n⬛️⬛️⬛️\n\nhttps://tridle.netlify.app/'
    )
  })
})
