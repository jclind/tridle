export const setLocalStorage = (gameStatus, selectedRow, pastWords, answer) => {
  const currentGameData = JSON.parse(localStorage.getItem('current-game'))
  const lastAnswer = currentGameData ? currentGameData.solution : ''
  // if (lastAnswer && lastAnswer !== answer) {
  //   localStorage.removeItem('current-game')
  //   console.log('removed')
  // }
  console.log(lastAnswer, answer)
  let expiration = new Date()
  expiration = new Date(expiration.setUTCHours(15, 32, 59, 999)).getTime()
  console.log(expiration, new Date().getTime())

  const data = {
    gameStatus,
    selectedRow,
    pastWords,
    solution: answer,
    expirationTime: expiration,
  }
  console.log(data)
  localStorage.setItem('current-game', JSON.stringify(data))
}
