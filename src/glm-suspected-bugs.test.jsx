import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { setUserGameStats } from './util/setLocalStorage'
import KeyBoard from './Components/Tridle/KeyBoard/KeyBoard'
import GameStatsModal from './Components/Navbar/GameStatsModal/GameStatsModal'

// Each comment: the input, what was expected, what the code does, file:line.
// All are skipped so the suite stays green; unskip one to watch it fail.

describe('suspected bugs', () => {
  it.skip('starts a fresh streak of 1 after skipping a day and winning', () => {
    // Winning 49h after the previous game should start a streak of 1, but the code writes 0: src/util/setLocalStorage.js:30-33
    localStorage.setItem(
      'user-game-stats',
      JSON.stringify({
        totalGames: 3,
        guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
        gamesWon: 2,
        gamesLost: 1,
        winStreak: 2,
        maxWinStreak: 2,
        lastUpdated: Date.now() - 49 * 60 * 60 * 1000,
      })
    )

    setUserGameStats('WON', 4)

    expect(JSON.parse(localStorage.getItem('user-game-stats')).winStreak).toBe(
      1
    )
  })

  it.skip('keeps a key marked in after a later guess greys it', () => {
    // A letter guessed 'in' then 'nin' should stay yellow on the keyboard, but only 'eq' is protected so the code overwrites it to 'nin': src/Components/Tridle/KeyBoard/KeyBoard.jsx:9-13
    render(
      <KeyBoard
        pastWords={[
          {
            word: 3,
            words: [
              { letter: 'A', position: 'in' },
              { letter: 'B', position: 'nin' },
              { letter: 'M', position: 'nin' },
            ],
          },
          {
            word: 3,
            words: [
              { letter: 'A', position: 'nin' },
              { letter: 'H', position: 'nin' },
              { letter: 'A', position: 'nin' },
            ],
          },
        ]}
        addLetter={() => {}}
        deleteLetter={() => {}}
        submitWord={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'a' }).className).toBe(
      'key btn in'
    )
  })

  it.skip('keeps the distribution bars at zero width when every game was lost', () => {
    // With gamesWon 0 every bar should be width '0%', but the code computes (0/0)*100 = NaN and jsdom drops the invalid style, leaving width '': src/Components/Navbar/GameStatsModal/GameStatsModal.jsx:123
    localStorage.setItem(
      'user-game-stats',
      JSON.stringify({
        totalGames: 2,
        guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
        gamesWon: 0,
        gamesLost: 2,
        winStreak: 0,
        maxWinStreak: 0,
        lastUpdated: Date.now(),
      })
    )

    render(
      <GameStatsModal statsModalOpen={true} setStatsModalOpen={() => {}} />
    )

    const widths = [
      ...document.body.querySelectorAll('.chart-line-container .line'),
    ].map(line => line.style.width)
    expect(widths).toEqual(
      Array.from({ length: 8 }, () => '0%')
    )
  })
})
