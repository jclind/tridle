export const setLocalStorage = (gameStatus, selectedRow, pastWords, answer) => {
  const data = {
    gameStatus,
    selectedRow,
    pastWords,
    solution: answer,
  }
  localStorage.setItem('current-game', JSON.stringify(data))
}

export const setUserGameStats = (gameStatus, numGuesses) => {
  const currStats = JSON.parse(localStorage.getItem('user-game-stats'))
  if (currStats) {
    const yesterday = new Date()
    yesterday.setHours(0, 0, 0, 0)
    yesterday.setDate(yesterday.getDate() - 1)

    const newTotalGames = currStats.totalGames + 1
    const newGuesses =
      gameStatus === 'WON'
        ? {
            ...currStats.guesses,
            [numGuesses]: currStats.guesses[numGuesses.toString()] + 1,
          }
        : currStats.guesses
    const newGamesWon =
      gameStatus === 'WON' ? currStats.gamesWon + 1 : currStats.gamesWon
    const newGamesLost =
      gameStatus === 'LOST' ? currStats.gamesLost + 1 : currStats.gamesLost
    // A win continues the streak if the last game was yesterday or today,
    // and starts a new one of 1 after a gap.
    const newWinStreak =
      gameStatus !== 'WON'
        ? 0
        : yesterday.getTime() <= currStats.lastUpdated
        ? currStats.winStreak + 1
        : 1
    const newMaxWinStreak =
      currStats.maxWinStreak < newWinStreak
        ? newWinStreak
        : currStats.maxWinStreak

    const gameStats = {
      totalGames: newTotalGames,
      guesses: newGuesses,
      gamesWon: newGamesWon,
      gamesLost: newGamesLost,
      winStreak: newWinStreak,
      maxWinStreak: newMaxWinStreak,
      lastUpdated: new Date().getTime(),
    }
    localStorage.setItem('user-game-stats', JSON.stringify(gameStats))
  } else {
    const guesses = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
    if (gameStatus === 'WON') {
      guesses[numGuesses] = 1
    }

    const gameStats = {
      totalGames: 1,
      guesses,
      gamesWon: gameStatus === 'WON' ? 1 : 0,
      gamesLost: gameStatus === 'LOST' ? 1 : 0,
      winStreak: gameStatus === 'WON' ? 1 : 0,
      maxWinStreak: gameStatus === 'WON' ? 1 : 0,
      lastUpdated: new Date().getTime(),
    }
    localStorage.setItem('user-game-stats', JSON.stringify(gameStats))
  }
}
