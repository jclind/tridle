import React, { useState, useEffect } from 'react'
import WordleRow from '../WordleRow/WordleRow'
import KeyBoard from './KeyBoard/KeyBoard'
import './Wordle.scss'
import words from '../../assets/data/words'
import { AiOutlineClose } from 'react-icons/ai'
import Modal from 'react-modal'
Modal.setAppElement('#root')

const WORD = 'AMONG'

const Wordle = () => {
  const localCurrGameData = JSON.parse(localStorage.getItem('current-game'))
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
    console.log('saving data')
    const data = {
      gameStatus,
      selectedRow,
      pastWords,
      solution: WORD,
    }
    localStorage.setItem('current-game', JSON.stringify(data))
  }

  useEffect(() => {
    setLocalStorage()
  }, [pastWords])

  // Modal functions
  useEffect(() => {
    if (gameStatus) {
      if (gameStatus === 'WON' || gameStatus === 'LOST') {
        return setGameOverModal(true)
      }
      setGameOverModal(false)
    }
  }, [gameStatus])
  function closeModal() {
    setGameOverModal(false)
  }

  const addLetterToCurrWord = key => {
    if (currWord.length >= 5 || gameStatus === 'WON' || gameStatus === 'LOST') {
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

    wordArr.map((ltr, idx) => {
      if (WORD.split('')[idx] === wordArr[idx]) {
        letters.push({ letter: ltr, position: 'eq' })
      } else if (WORD.includes(ltr)) {
        let modWord = WORD
        let splitCurrWord = currWord.join('').slice(0, idx)

        const numCurrLtrInWord = modWord.split(ltr).length - 1
        const numCurrLtrInCurrWord = splitCurrWord.split(ltr).length - 1

        let numCorrectInWord = 0
        wordArr.map((currLtr, idx) => {
          if (WORD.split('')[idx] === wordArr[idx] && wordArr[idx] === ltr) {
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
    } else if (selectedRow > 4) {
      setGameStatus('LOST')
    }
    return letters
  }
  const submitWord = () => {
    if (currWord.length !== 5) {
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
    if (currWord.length === 5) {
      setCurrWordValid(words.indexOf(currWord.join('').toLowerCase()) !== -1)
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
          if (currWord.length >= 5) {
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
  }, [currWord, currWordValid])

  const rows = []
  for (let i = 0; i <= 5; i++) {
    rows.push(
      <WordleRow
        key={i}
        isSelected={selectedRow === i}
        currWord={currWord}
        pastWord={pastWords[i]}
        currWordValid={currWordValid}
      />
    )
  }

  return (
    <>
      <Modal
        isOpen={gameOverModal}
        onRequestClose={closeModal}
        contentLabel='Example Modal'
        className='game-over-modal'
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              The word was <span className='word'>{WORD}</span>.
            </div>
          </>
        )}
      </Modal>
      <div className='wordle'>{rows}</div>
      <KeyBoard
        pastWords={pastWords}
        addLetter={addLetterToCurrWord}
        deleteLetter={deleteLetter}
        submitWord={submitWord}
      />
    </>
  )
}

export default Wordle
