import { useState, useEffect } from 'react'
import diffDays from './diffDays'
import { answers } from '../assets/data/threeLetterWords'
import { scheduleJob } from 'node-schedule'

const startDate = new Date(
  'Wed Mar 30 2022 00:00:00 GMT-0400 (Eastern Daylight Time)'
)

export function useDailyAnswer() {
  // Returns word from answers array of words based on current day. Answer will be the same for everyone every day
  const getAnswer = () => {
    const currDate = new Date()
    currDate.setHours(0, 0, 0, 0)
    const numDays = diffDays(startDate, currDate) % 500
    const word = answers[numDays]
    return word.toUpperCase()
  }
  const [answer, setAnswer] = useState(getAnswer)

  useEffect(() => {
    // Update answer at the start of every day
    scheduleJob('0 0 * * *', () => {
      setAnswer(getAnswer)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return answer
}

export const getTridleNumber = () => {
  return diffDays(startDate, new Date())
}
