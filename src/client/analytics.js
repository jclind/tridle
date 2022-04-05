import { db } from './firebase'
import {
  doc,
  addDoc,
  collection,
  updateDoc,
  increment,
  arrayUnion,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

const getDeviceType = () => {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return 'mobile'
  }
  return 'desktop'
}

export const logGameEvent = (status, numGuesses) => {
  const statsRef = doc(db, 'stats', 'gameStats')
  const timelineRef = collection(db, 'timeline')

  const deviceType = getDeviceType()
  const id = uuidv4()
  const currDate = new Date()
  const currUserStats = JSON.parse(localStorage.getItem('user-game-stats'))

  if (status === 'WON') {
    updateDoc(statsRef, {
      games_completed: increment(1),
      games_won: increment(1),
      guesses: increment(numGuesses),
      deviceType: {
        mobile: deviceType === 'mobile' ? increment(1) : increment(0),
        tablet: deviceType === 'tablet' ? increment(1) : increment(0),
        desktop: deviceType === 'desktop' ? increment(1) : increment(0),
      },
    })
    addDoc(timelineRef, {
      id: id,
      time: currDate,
      guess: numGuesses,
      won: true,
      deviceType,
      stats: currUserStats,
    })
  } else if (status === 'LOST') {
    updateDoc(statsRef, {
      games_completed: increment(1),
      games_lost: increment(1),
      deviceType: {
        mobile: deviceType === 'mobile',
        tablet: deviceType === 'tablet',
        desktop: deviceType === 'desktop',
      },
    })
    addDoc(timelineRef, {
      id: id,
      time: currDate,
      won: false,
      deviceType,
      stats: currUserStats,
    })
  }
}
