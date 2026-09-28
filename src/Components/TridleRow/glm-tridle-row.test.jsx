import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import TridleRow from './TridleRow'

const pastWord = positions => ({
  word: 3,
  words: positions.map(([letter, position]) => ({ letter, position })),
})

const renderRow = props =>
  render(
    <TridleRow
      isSelected={false}
      currWord={[]}
      pastWord={undefined}
      currWordValid={true}
      LTRS_IN_WORD={3}
      {...props}
    />
  )

const rowEl = container => container.querySelector('.tridle-row')
const tileInfo = container =>
  [...container.querySelectorAll('.tridle-tile')].map(t => ({
    letter: t.textContent,
    className: t.className,
  }))

describe('TridleRow', () => {
  it('shows a past guess with each letter in its own state class', () => {
    const { container } = renderRow({
      pastWord: pastWord([
        ['A', 'in'],
        ['C', 'eq'],
        ['T', 'nin'],
      ]),
    })

    expect(tileInfo(container)).toEqual([
      { letter: 'A', className: 'in tridle-tile' },
      { letter: 'C', className: 'eq tridle-tile' },
      { letter: 'T', className: 'nin tridle-tile' },
    ])
  })

  it('renders three tiles for an empty row with no state class', () => {
    const { container } = renderRow()

    expect(tileInfo(container)).toEqual([
      { letter: '', className: 'tridle-tile' },
      { letter: '', className: 'tridle-tile' },
      { letter: '', className: 'tridle-tile' },
    ])
  })

  it('shows the word being typed in the selected row', () => {
    const { container } = renderRow({ isSelected: true, currWord: ['C', 'A'] })

    expect(tileInfo(container)).toEqual([
      { letter: 'C', className: 'tridle-tile' },
      { letter: 'A', className: 'tridle-tile' },
      { letter: '', className: 'tridle-tile' },
    ])
  })

  it('flags a full invalid word in the selected row', () => {
    const { container } = renderRow({
      isSelected: true,
      currWord: ['Q', 'Q', 'Q'],
      currWordValid: false,
    })

    expect(rowEl(container).className).toBe('tridle-row invalid')
  })

  it('does not flag a short word even when the word is invalid so far', () => {
    const { container } = renderRow({
      isSelected: true,
      currWord: ['Q', 'Q'],
      currWordValid: false,
    })

    expect(rowEl(container).className).toBe('tridle-row')
  })

  it('never flags a past row as invalid', () => {
    const { container } = renderRow({
      isSelected: false,
      currWord: ['Q', 'Q', 'Q'],
      currWordValid: false,
      pastWord: pastWord([
        ['D', 'nin'],
        ['O', 'nin'],
        ['G', 'nin'],
      ]),
    })

    expect(rowEl(container).className).toBe('tridle-row')
  })
})
