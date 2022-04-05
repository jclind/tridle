import React, { useEffect } from 'react'
import { AiOutlineClose, AiOutlineShareAlt } from 'react-icons/ai'

import Modal from 'react-modal'
Modal.setAppElement('#root')

const EndGameModal = ({
  gameOverModal,
  setGameOverModal,
  gameStatus,
  selectedRow,
  answer,
  tridleNumber,
  pastWords,
}) => {
  const copyResults = (numGuesses, tridleNumber, pastWords) => {
    let text = `Tridle #${tridleNumber}\n`

    pastWords.forEach(word => {
      let wordStr = '\n'
      word.words.forEach(letter => {
        if (letter.position === 'eq') {
          wordStr += '🟩'
        } else if (letter.position === 'in') {
          wordStr += '🟨'
        } else {
          wordStr += '⬛️'
        }
      })
      text += wordStr
    })

    text += '\n\nhttps://tridle.netlify.app/'

    return navigator.clipboard.writeText(text)
  }

  const closeModal = () => {
    setGameOverModal(false)
  }

  useEffect(() => {
    if (gameStatus) {
      if (gameStatus === 'WON' || gameStatus === 'LOST') {
        return setGameOverModal(true)
      }
      setGameOverModal(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus])

  const primaryBackground = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--primary-background')
    }
  })()
  const primaryText = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--primary-text')
    }
  })()
  const correctGuess = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--correct-guess-color')
    }
  })()
  return (
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
          background: primaryBackground,
          color: primaryText,
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
            Congrats, you completed the Tridle in {selectedRow} guess
            {selectedRow > 1 && 'es'}!
          </div>
          <div className='copy-results btn'>
            <button
              className='copy'
              style={{ background: correctGuess }}
              onClick={() => copyResults(selectedRow, tridleNumber, pastWords)}
            >
              SHARE
              <AiOutlineShareAlt className='icon' />
            </button>
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
          <div className='copy-results btn'>
            <button
              className='copy'
              style={{ background: correctGuess }}
              onClick={() => copyResults(selectedRow, tridleNumber, pastWords)}
            >
              SHARE
              <AiOutlineShareAlt className='icon' />
            </button>
          </div>
        </>
      )}
    </Modal>
  )
}

export default EndGameModal
