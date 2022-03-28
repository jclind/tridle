import React, { useState, useEffect } from 'react'
import WordleRow from '../WordleRow/WordleRow'
import KeyBoard from './KeyBoard/KeyBoard'
import './Wordle.scss'
import words from '../../assets/data/words'
import { AiOutlineClose } from 'react-icons/ai'
import Modal from 'react-modal'
Modal.setAppElement('#root')

const WORD = 'FLUFF'

const Wordle = () => {
  const [gameOver, setGameOver] = useState(false)
  const [gameOverModal, setGameOverModal] = useState(gameOver)

  useEffect(() => {
    setGameOverModal(gameOver)
  }, [gameOver])

  const [selectedRow, setSelectedRow] = useState(0)
  const [pastWords, setPastWords] = useState([])
  const [currWord, setCurrWord] = useState([])
  const [currWordValid, setCurrWordValid] = useState(true)

  function openModal() {
    setGameOverModal(true)
  }
  function closeModal() {
    setGameOverModal(false)
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
        // modWord.replace(exp, '').length
        // console.log(modWord.replace(exp, ''), exp)
        console.log(
          numCurrLtrInWord,
          numCurrLtrInCurrWord,
          numCorrectInWord,
          splitCurrWord
        )
        // IF LETTER COMES BEFORE LETTER IN POSITION
      } else {
        letters.push({ letter: ltr, position: 'nin' })
      }
    })

    // Check if word is correct
    const allLettersCorrect =
      letters.filter(ltr => ltr.position !== 'eq').length === 0
    if (allLettersCorrect) {
      setGameOver(true)
    }

    return letters
  }

  useEffect(() => {
    if (currWord.length === 5) {
      setCurrWordValid(words.indexOf(currWord.join('').toLowerCase()) !== -1)
    } else {
      setCurrWordValid(true)
    }
    const f = e => {
      if (!gameOver) {
        if (
          e.key.length === 1 &&
          e.key.match(/^[a-zA-Z]*$/) &&
          !e.altKey &&
          !e.ctrlKey
        ) {
          if (currWord.length >= 5) {
            return
          }
          setCurrWord(oldArray => [...oldArray, e.key.toUpperCase()])
        }
        if (e.key === 'Backspace') {
          const newArr = currWord.slice(0, currWord.length - 1)
          setCurrWord([...newArr])
        }

        if (e.key === 'Enter') {
          if (currWord.length !== 5) {
            return
          }
          console.log(currWordValid)
          if (currWordValid) {
            console.log('bruh')
            setPastWords(prevWords => [
              ...prevWords,
              { word: currWord.length, words: enterWord(currWord) },
            ])
            setCurrWord([])
            setSelectedRow(selectedRow + 1)
          } else {
            console.log('among us')
            setCurrWord([])
          }
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
        <h2>Puzzle Solved!</h2>
        <button className='close-modal-btn btn' onClick={closeModal}>
          <AiOutlineClose />
        </button>
        <div className='completed-text'>
          Congrats, you completed the wordle in {selectedRow} guess!
          {selectedRow > 1 && 'es'}
        </div>
      </Modal>
      <div className='wordle'>{rows}</div>
      <KeyBoard pastWords={pastWords} />
    </>
  )
}

export default Wordle
