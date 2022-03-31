import React, { useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

import Modal from 'react-modal'
Modal.setAppElement('#root')

const EndGameModal = ({
  gameOverModal,
  setGameOverModal,
  gameStatus,
  selectedRow,
  answer,
}) => {
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
            Congrats, you completed the Tridle in {selectedRow} guess
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
  )
}

export default EndGameModal
