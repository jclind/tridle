export const setLocalStorage = (gameStatus, selectedRow, pastWords, answer) => {
  let expiration = new Date()
  expiration = new Date(expiration.setUTCHours(23, 59, 59, 999)).getTime()

  const data = {
    gameStatus,
    selectedRow,
    pastWords,
    solution: answer,
    expirationTime: expiration,
  }
  localStorage.setItem('current-game', JSON.stringify(data))
}
