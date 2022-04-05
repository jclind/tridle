import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import './GameStatsModal.scss'
import Modal from 'react-modal'
Modal.setAppElement('#root')

const GameStatsModal = ({ statsModalOpen, setStatsModalOpen }) => {
  const closeStatsModal = () => {
    setStatsModalOpen(false)
  }

  const primaryBackground = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--primary-background')
    }
  })()
  const secondaryBackground = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--secondary-background')
    }
  })()
  const primaryText = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--primary-text')
    }
  })()
  const secondaryText = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--secondary-text')
    }
  })()

  const total = 10
  const three = 3
  const four = 5
  const data = {
    total: 10,
    guesses: { 1: 0, 2: 1, 3: 3, 4: 5, 5: 0, 6: 1, 7: 0, 8: 0 },
  }
  return (
    <Modal
      isOpen={statsModalOpen}
      onRequestClose={closeStatsModal}
      contentLabel='Example Modal'
      className='game-stats-modal modal'
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
      <>
        <button className='close-modal-btn btn' onClick={closeStatsModal}>
          <AiOutlineClose />
        </button>
        <h2>Tridle Statistics</h2>
        <div className='content'>
          <div className='stats'>
            <div className='data games-played'>
              <div className='num'>1</div>
              <label className='data-label' style={{ color: secondaryText }}>
                Played
              </label>
            </div>
            <div className='data win-percentage'>
              <div className='num'>0</div>
              <label className='data-label' style={{ color: secondaryText }}>
                Win %
              </label>
            </div>
            <div className='data current-win-streak'>
              <div className='num'>0</div>
              <label className='data-label' style={{ color: secondaryText }}>
                Current Streak
              </label>
            </div>
            <div className='data max-win-streak'>
              <div className='num'>0</div>
              <label className='data-label' style={{ color: secondaryText }}>
                Max Streak
              </label>
            </div>
          </div>
          <div className='distribution'>
            <h2>Win Distribution</h2>
            <div className='chart'>
              {Object.keys(data.guesses).map((currNum, index) => {
                const numGuesses = data.guesses[currNum]
                const total = data.total
                return (
                  <div className='chart-line-container'>
                    <span className='num'>{currNum}</span>
                    <div
                      className='line'
                      style={{ width: `${(numGuesses / total) * 100}%` }}
                    >
                      {numGuesses}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </>
    </Modal>
  )
}

export default GameStatsModal
