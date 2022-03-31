import React, { useState, useEffect } from 'react'
import WordleRow from '../WordleRow/WordleRow'
import KeyBoard from './KeyBoard/KeyBoard'
import './Wordle.scss'
import { threeLetterWords } from '../../assets/data/threeLetterWords'
import { AiOutlineClose } from 'react-icons/ai'
import { useDailyAnswer } from '../../util/useDailyAnswer'
import Modal from 'react-modal'
Modal.setAppElement('#root')

const NUM_GUESSES = 8
const LTRS_IN_WORD = 3

const Wordle = () => {
  const answer = useDailyAnswer()

  useEffect(() => {
    console.log(answer)
  }, [answer])

  let localCurrGameData = JSON.parse(localStorage.getItem('current-game'))
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

  useEffect(() => {
    setLocalStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastWords])

  // Modal functions
  useEffect(() => {
    if (gameStatus) {
      if (gameStatus === 'WON' || gameStatus === 'LOST') {
        return setGameOverModal(true)
      }
      setGameOverModal(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus])
  function closeModal() {
    setGameOverModal(false)
  }

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

  useEffect(() => {
    if (currWord.length === LTRS_IN_WORD) {
      setCurrWordValid(
        threeLetterWords.indexOf(currWord.join('').toLowerCase()) !== -1
      )
    } else {
      setCurrWordValid(true)
    }
    const f = e => {
      if (gameStatus === 'IN_PROGRESS') {
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

    window.addEventListener('keydown', f)

    return () => window.removeEventListener('keydown', f)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currWord, currWordValid])

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

  return (
    <div className='wordle-container'>
      <Modal
        isOpen={gameOverModal}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
        className='game-over-modal modal'
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            background: (() => {
              if (document.querySelector('.app')) {
                const style = getComputedStyle(document.querySelector('.app'))
                return style.getPropertyValue('--primary-background')
              }
            })(),
            color: (() => {
              if (document.querySelector('.app')) {
                const style = getComputedStyle(document.querySelector('.app'))
                return style.getPropertyValue('--primary-text')
              }
            })(),
          },
        }}
      >
        {gameStatus === 'WON' ? (
          <>
            <h2>Puzzle Solved!</h2>
            <button className='close-modal-btn btn' onClick={closeModal}>
              <AiOutlineClose />
            </button>
            <div className='completed-text'>
              Congrats, you completed the wordle in {selectedRow} guess
              {selectedRow > 1 && 'es'}!
            </div>
          </>
        ) : (
          <>
            <h2>You'll get 'em next time!</h2>
            <button className='close-modal-btn btn' onClick={closeModal}>
              <AiOutlineClose />
            </button>
            <div className='completed-text'>
              The word was <span className='word'>{answer}</span>.
            </div>
          </>
        )}
      </Modal>
      <div className='puzzle-container'>
        <div className='wordle'>{rows}</div>
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

export default Wordle
