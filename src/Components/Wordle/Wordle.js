import React, { useState, useEffect } from 'react'
import WordleRow from '../WordleRow/WordleRow'
import KeyBoard from './KeyBoard/KeyBoard'
import EndGameModal from '../EndGameModal/EndGameModal'
import './Wordle.scss'
import { threeLetterWords } from '../../assets/data/threeLetterWords'
import { useDailyAnswer } from '../../util/useDailyAnswer'

const NUM_GUESSES = 8
const LTRS_IN_WORD = 3

const Wordle = () => {
  // Get daily answer
  const answer = useDailyAnswer()

  let localCurrGameData = JSON.parse(localStorage.getItem('current-game'))
  // If the expiration time is passed, clear 'current-game' localStorage item
  if (
    localCurrGameData &&
    localCurrGameData.expirationTime &&
    localCurrGameData.expirationTime < new Date().getTime()
  ) {
    localStorage.removeItem('current-game')
    localCurrGameData = null
  }

  const [gameStatus, setGameStatus] = useState(() => {
    if (localCurrGameData && localCurrGameData.gameStatus)
      return localCurrGameData.gameStatus
    return 'IN_PROGRESS'
  })
  const [gameOverModal, setGameOverModal] = useState(false)

  const [selectedRow, setSelectedRow] = useState(() => {
    if (localCurrGameData && localCurrGameData.selectedRow)
      return localCurrGameData.selectedRow
    return 0
  })
  const [pastWords, setPastWords] = useState(() => {
    if (localCurrGameData && localCurrGameData.pastWords)
      return localCurrGameData.pastWords
    return []
  })
  const [currWord, setCurrWord] = useState([])
  const [currWordValid, setCurrWordValid] = useState(true)

  const setLocalStorage = () => {
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
  // Set localStorage if pastWords or answer changes
  useEffect(() => {
    setLocalStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastWords, answer])

  const addLetterToCurrWord = key => {
    if (
      currWord.length >= LTRS_IN_WORD ||
      gameStatus === 'WON' ||
      gameStatus === 'LOST'
    ) {
      return
    }
    return setCurrWord(oldArray => [...oldArray, key.toUpperCase()])
  }
  const deleteLetter = () => {
    const newArr = currWord.slice(0, currWord.length - 1)
    setCurrWord([...newArr])
  }

  const enterWord = wordArr => {
    const letters = []
    wordArr.forEach((ltr, idx) => {
      if (answer.split('')[idx] === wordArr[idx]) {
        letters.push({ letter: ltr, position: 'eq' })
      } else if (answer.includes(ltr)) {
        let modWord = answer
        let splitCurrWord = currWord.join('').slice(0, idx)

        const numCurrLtrInWord = modWord.split(ltr).length - 1
        const numCurrLtrInCurrWord = splitCurrWord.split(ltr).length - 1

        let numCorrectInWord = 0
        wordArr.forEach((currLtr, idx) => {
          if (answer.split('')[idx] === wordArr[idx] && wordArr[idx] === ltr) {
            numCorrectInWord++
          }
        })

        if (
          numCurrLtrInWord >= numCurrLtrInCurrWord &&
          numCurrLtrInWord > numCorrectInWord
        ) {
          letters.push({ letter: ltr, position: 'in' })
        } else {
          letters.push({ letter: ltr, position: 'nin' })
        }
      } else {
        letters.push({ letter: ltr, position: 'nin' })
      }
    })

    // Check if word is correct
    const allLettersCorrect =
      letters.filter(ltr => ltr.position !== 'eq').length === 0
    if (allLettersCorrect) {
      setGameStatus('WON')
    } else if (selectedRow >= NUM_GUESSES - 1) {
      setGameStatus('LOST')
    }
    return letters
  }
  const submitWord = () => {
    if (currWord.length !== LTRS_IN_WORD) {
      return
    }
    if (currWordValid) {
      setSelectedRow(selectedRow + 1)
      setPastWords(prevWords => [
        ...prevWords,
        { word: currWord.length, words: enterWord(currWord) },
      ])
      setCurrWord([])
    } else {
      setCurrWord([])
    }
  }

  // Event Listeners
  useEffect(() => {
    // If the currWord is LTRS_IN_WORD characters long, check it's validity as a word
    if (currWord.length === LTRS_IN_WORD) {
      setCurrWordValid(
        threeLetterWords.indexOf(currWord.join('').toLowerCase()) !== -1
      )
    } else {
      setCurrWordValid(true)
    }
    // Call functions based on keyboard event listeners
    const keyEvents = e => {
      if (gameStatus === 'IN_PROGRESS') {
        // If a letter is typed, add that letter to the current word as long as the current word isn't max length
        if (
          e.key.length === 1 &&
          e.key.match(/^[a-zA-Z]*$/) &&
          !e.altKey &&
          !e.ctrlKey
        ) {
          if (currWord.length >= LTRS_IN_WORD) {
            return
          }
          addLetterToCurrWord(e.key)
        }
        if (e.key === 'Backspace') {
          deleteLetter()
        }
        if (e.key === 'Enter') {
          submitWord()
        }
      }
    }

    window.addEventListener('keydown', keyEvents)

    return () => window.removeEventListener('keydown', keyEvents)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currWord, currWordValid])

  return (
    <div className='wordle-container'>
      <EndGameModal
        gameOverModal={gameOverModal}
        setGameOverModal={setGameOverModal}
        gameStatus={gameStatus}
        selectedRow={selectedRow}
        answer={answer}
      />
      <div className='puzzle-container'>
        <div className='wordle'>
          <Rows
            selectedRow={selectedRow}
            currWord={currWord}
            pastWords={pastWords}
            currWordValid={currWordValid}
          />
        </div>
      </div>
      <KeyBoard
        pastWords={pastWords}
        addLetter={addLetterToCurrWord}
        deleteLetter={deleteLetter}
        submitWord={submitWord}
      />
    </div>
  )
}

const Rows = ({ selectedRow, currWord, pastWords, currWordValid }) => {
  const rows = []
  for (let i = 0; i < NUM_GUESSES; i++) {
    rows.push(
      <WordleRow
        key={i}
        isSelected={selectedRow === i}
        currWord={currWord}
        pastWord={pastWords[i]}
        currWordValid={currWordValid}
        LTRS_IN_WORD={LTRS_IN_WORD}
      />
    )
  }
  return rows
}

export default Wordle
