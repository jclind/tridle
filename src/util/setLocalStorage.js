export const setLocalStorage = (gameStatus, selectedRow, pastWords, answer) => {
  const data = {
    gameStatus,
    selectedRow,
    pastWords,
    solution: answer,
  }
  localStorage.setItem('current-game', JSON.stringify(data))
}
