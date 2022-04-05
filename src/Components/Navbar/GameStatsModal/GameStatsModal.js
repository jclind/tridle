import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import './GameStatsModal.scss'
import Modal from 'react-modal'
Modal.setAppElement('#root')

const GameStatsModal = ({ statsModalOpen, setStatsModalOpen }) => {
  const userGameStats = JSON.parse(localStorage.getItem('user-game-stats'))

  const closeStatsModal = () => {
    setStatsModalOpen(false)
  }

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
  const secondaryText = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--secondary-text')
    }
  })()

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
        <div className='content'>
          <div className='stats-container'>
            <h2>Tridle Statistics</h2>
            <div className='stats'>
              <div className='data games-played'>
                <div className='num'>
                  {userGameStats ? userGameStats.totalGames : 0}
                </div>
                <label className='data-label' style={{ color: secondaryText }}>
                  Played
                </label>
              </div>
              <div className='data win-percentage'>
                <div className='num'>
                  {userGameStats
                    ? Math.round(
                        (userGameStats.gamesWon / userGameStats.totalGames) *
                          100
                      )
                    : 0}
                </div>
                <label className='data-label' style={{ color: secondaryText }}>
                  Win %
                </label>
              </div>
              <div className='data current-win-streak'>
                <div className='num'>
                  {userGameStats ? userGameStats.winStreak : 0}
                </div>
                <label className='data-label' style={{ color: secondaryText }}>
                  Current Streak
                </label>
              </div>
              <div className='data max-win-streak'>
                <div className='num'>
                  {userGameStats ? userGameStats.maxWinStreak : 0}
                </div>
                <label className='data-label' style={{ color: secondaryText }}>
                  Max Streak
                </label>
              </div>
            </div>
          </div>
          <div className='distribution'>
            <h2>Win Distribution</h2>
            <ChartDistribution
              guesses={
                userGameStats
                  ? userGameStats.guesses
                  : { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 1 }
              }
              total={userGameStats ? userGameStats.totalGames : 0}
            />
          </div>
        </div>
      </>
    </Modal>
  )
}

const ChartDistribution = ({ guesses }) => {
  return (
    <div className='chart'>
      {Object.keys(guesses).map((currNum, index) => {
        const numGuesses = guesses[currNum]
        const total = guesses.total
        return (
          <div className='chart-line-container' key={index}>
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
  )
}

export default GameStatsModal
