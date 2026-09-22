import { useState, useEffect } from 'react'
import diffDays from './diffDays'
import { answers } from '../assets/data/threeLetterWords'

const startDate = new Date(
  'Wed Mar 30 2022 00:00:00 GMT-0400 (Eastern Daylight Time)'
)

export function useDailyAnswer() {
  // Returns word from answers array of words based on current day. Answer will be the same for everyone every day
  const getAnswer = () => {
    const currDate = new Date()
    currDate.setHours(0, 0, 0, 0)
    const numDays = diffDays(startDate, currDate) % 427
    const word = answers[numDays]
    return word.toUpperCase()
  }
  const [answer, setAnswer] = useState(getAnswer)

  useEffect(() => {
    // Update answer at the start of every day
    let timeoutId
    const scheduleNextMidnight = () => {
      const nextMidnight = new Date()
      nextMidnight.setHours(24, 0, 0, 0)
      timeoutId = setTimeout(() => {
        setAnswer(getAnswer)
        scheduleNextMidnight()
      }, nextMidnight - new Date())
    }
    scheduleNextMidnight()
    return () => clearTimeout(timeoutId)
  }, [])

  return answer
}

export const getTridleNumber = () => {
  return diffDays(startDate, new Date())
}
