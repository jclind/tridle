import React, { useState, useEffect } from 'react'
import TridleRow from '../TridleRow/TridleRow'
import KeyBoard from './KeyBoard/KeyBoard'
import EndGameModal from '../EndGameModal/EndGameModal'
import { setLocalStorage } from '../../util/setLocalStorage'
import { analytics } from '../../client/firebase'
import { logGameEvent } from '../../client/analytics'

import './Tridle.scss'
import { threeLetterWords } from '../../assets/data/threeLetterWords'
import { useDailyAnswer } from '../../util/useDailyAnswer'

const NUM_GUESSES = 8
const LTRS_IN_WORD = 3

const Tridle = () => {
  // Get daily answer
  const answer = useDailyAnswer()

  let localCurrGameData = JSON.parse(localStorage.getItem('current-game'))

  const [gameStatus, setGameStatus] = useState(() => {
    if (localCurrGameData && localCurrGameData.gameStatus)
      return localCurrGameData.gameStatus
    return 'IN_PROGRESS'
  })
  useEffect(() => {
    if (gameStatus === 'WON') {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus])
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

  const resetGame = () => {
    setGameStatus('IN_PROGRESS')
    setGameOverModal(false)
    setSelectedRow(0)
    setPastWords([])
    setCurrWord([])
  }

  // Set localStorage if pastWords or answer changes
  useEffect(() => {
    if (localCurrGameData && localCurrGameData.solution !== answer) {
      setLocalStorage('IN_PROGRESS', 0, [], answer)
      resetGame()
    } else {
      setLocalStorage(gameStatus, selectedRow, pastWords, answer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastWords, answer])

  const addLetterToCurrWord = key => {
    // Don't allow input after game has finished
    if (
      currWord.length >= LTRS_IN_WORD ||
      gameStatus === 'WON' ||
      gameStatus === 'LOST'
    ) {
      return
    }
    // Add typed key to currWord array
    return setCurrWord(oldArray => [...oldArray, key.toUpperCase()])
  }
  const deleteLetter = () => {
    const newArr = currWord.slice(0, currWord.length - 1)
    setCurrWord([...newArr])
  }

  const enterWord = wordArr => {
    const letters = []
    wordArr.forEach((ltr, idx) => {
      // if the current word letter matches the equal indexed letter in answer, the letter is correct
      if (answer.split('')[idx] === wordArr[idx]) {
        letters.push({ letter: ltr, position: 'eq' })
      } else if (answer.includes(ltr)) {
        let modWord = answer
        let splitCurrWord = currWord.join('').slice(0, idx) // get array of characters up to the current idx in forEach

        const numCurrLtrInAnswer = modWord.split(ltr).length - 1 // gets number of times the current letter is in the answer
        const numCurrLtrInCurrWord = splitCurrWord.split(ltr).length - 1 // gets number of times the current letter is in the current word

        let numCorrect = 0 // Holds amount of times the current letter is correctly placed the answer word
        wordArr.forEach((currLtr, i) => {
          // If the current letter matches the letter in the same index in answer, increment numCorrect
          if (answer.split('')[i] === wordArr[i] && wordArr[i] === ltr) {
            numCorrect++
          }
        })

        // If the number of times the current letter is in the answer is greater than both the number of times the letter is correct in the current word,
        // and the number of time the current letter is in the current word, the current letter is marked as 'in' the answer
        // Simply, we are making sure the character isn't marked as 'in' the word too many times
        if (
          numCurrLtrInAnswer > numCurrLtrInCurrWord &&
          numCurrLtrInAnswer > numCorrect
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
      logGameEvent('WON', selectedRow)
    } else if (selectedRow >= NUM_GUESSES - 1) {
      setGameStatus('LOST')
      logGameEvent('LOST', selectedRow)
    }
    return letters
  }
  const submitWord = () => {
    // If the current word doesn't have the correct amount of characters, return
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
    <div className='tridle-container'>
      <EndGameModal
        gameOverModal={gameOverModal}
        setGameOverModal={setGameOverModal}
        gameStatus={gameStatus}
        selectedRow={selectedRow}
        answer={answer}
      />
      <div className='puzzle-container'>
        <div className='tridle'>
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
      <TridleRow
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

export default Tridle
