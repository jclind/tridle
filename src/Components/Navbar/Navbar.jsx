import React, { useState } from 'react'
import ToggleTheme from './ToggleTheme'
import './Navbar.scss'
import {
  AiOutlineInfoCircle,
  AiOutlineSetting,
  AiOutlineClose,
} from 'react-icons/ai'
import { IoIosStats } from 'react-icons/io'
import SettingsModal from './SettingsModal/SettingsModal'
import InfoModal from './InfoModal/InfoModal'
import GameStatsModal from './GameStatsModal/GameStatsModal'

import Modal from 'react-modal'
Modal.setAppElement('#root')

const Navbar = ({ isDark, setIsDark, isColorBlind, setIsColorBlind }) => {
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [statsModalOpen, setStatsModalOpen] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const closeSupportModal = () => {
    setSupportModalOpen(false)
  }
  const [optionsModalOpen, setOptionsModalOpen] = useState(false)

  return (
    <>
      <nav className='nav' id='nav'>
        <div className='nav-center'>
          <div className='nav-left'>
            <ToggleTheme isDark={isDark} setIsDark={setIsDark} />
          </div>
          <div className='nav-middle'>
            <h1 className='title'>TRIDLE</h1>
          </div>
          <div className='nav-right'>
            <button
              className='btn nav-btn info'
              onClick={() => setInfoModalOpen(true)}
            >
              <AiOutlineInfoCircle className='icon nav-icon' />
            </button>
            <button
              className='btn nav-btn stats'
              onClick={() => setStatsModalOpen(true)}
            >
              <IoIosStats className='icon nav-icon' />
            </button>
            <button
              className='btn nav-btn settings'
              onClick={() => setOptionsModalOpen(true)}
            >
              <AiOutlineSetting className='settings-icon nav-icon' />
            </button>
          </div>
        </div>
      </nav>
      <InfoModal
        infoModalOpen={infoModalOpen}
        setInfoModalOpen={setInfoModalOpen}
      />
      <Modal
        isOpen={supportModalOpen}
        onRequestClose={closeSupportModal}
        contentLabel='Example Modal'
        className='support-modal modal'
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
        <>
          <h2>Content will go here</h2>
          <button className='close-modal-btn btn' onClick={closeSupportModal}>
            <AiOutlineClose />
          </button>
          <div className='completed-text'>More content</div>
        </>
      </Modal>
      <GameStatsModal
        statsModalOpen={statsModalOpen}
        setStatsModalOpen={setStatsModalOpen}
      />
      <SettingsModal
        optionsModalOpen={optionsModalOpen}
        setOptionsModalOpen={setOptionsModalOpen}
        isColorBlind={isColorBlind}
        setIsColorBlind={setIsColorBlind}
      />
    </>
  )
}

export default Navbar
