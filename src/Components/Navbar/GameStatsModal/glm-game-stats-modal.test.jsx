import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import GameStatsModal from './GameStatsModal'

const statsModal = props =>
  render(
    <GameStatsModal statsModalOpen={true} setStatsModalOpen={() => {}} {...props} />
  )

const statValue = label =>
  document.body
    .querySelector('.' + label)
    .querySelector('.num').textContent

const chartLines = () =>
  [...document.body.querySelectorAll('.chart-line-container')].map(line => ({
    label: line.querySelector('.num').textContent,
    count: line.querySelector('.line').textContent,
    width: line.querySelector('.line').style.width,
  }))

const seedStats = stats =>
  localStorage.setItem('user-game-stats', JSON.stringify(stats))

describe('GameStatsModal', () => {
  it('shows zeros when nothing has been played', () => {
    statsModal()

    expect(statValue('games-played')).toBe('0')
    expect(statValue('win-percentage')).toBe('0')
    expect(statValue('current-win-streak')).toBe('0')
    expect(statValue('max-win-streak')).toBe('0')
    expect(chartLines()).toHaveLength(8)
  })

  it('shows the saved totals and streaks', () => {
    seedStats({
      totalGames: 4,
      guesses: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0, 6: 0, 7: 0, 8: 0 },
      gamesWon: 2,
      gamesLost: 2,
      winStreak: 2,
      maxWinStreak: 3,
      lastUpdated: Date.now(),
    })

    statsModal()

    expect(statValue('games-played')).toBe('4')
    expect(statValue('win-percentage')).toBe('50')
    expect(statValue('current-win-streak')).toBe('2')
    expect(statValue('max-win-streak')).toBe('3')
  })

  it('sizes each distribution bar against the wins', () => {
    seedStats({
      totalGames: 4,
      guesses: { 1: 0, 2: 1, 3: 0, 4: 1, 5: 0, 6: 0, 7: 0, 8: 0 },
      gamesWon: 2,
      gamesLost: 2,
      winStreak: 2,
      maxWinStreak: 3,
      lastUpdated: Date.now(),
    })

    statsModal()

    const lines = chartLines()
    expect(lines.map(l => l.label)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
    ])
    expect(lines[1]).toEqual({ label: '2', count: '1', width: '50%' })
    expect(lines[3]).toEqual({ label: '4', count: '1', width: '50%' })
    expect(lines[0]).toEqual({ label: '1', count: '0', width: '0%' })
  })
})
