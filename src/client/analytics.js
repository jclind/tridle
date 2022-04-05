import { db } from './firebase'
import { doc, updateDoc, increment } from 'firebase/firestore'

export const logGameEvent = (status, numGuesses) => {
  const statsRef = doc(db, 'stats', 'gameStats')
  if (status === 'WON') {
    updateDoc(statsRef, {
      games_completed: increment(1),
      games_won: increment(1),
      guesses: increment(numGuesses),
    })
  } else if (status === 'LOST') {
    updateDoc(statsRef, {
      games_completed: increment(1),
      games_lost: increment(1),
    })
  }
}
