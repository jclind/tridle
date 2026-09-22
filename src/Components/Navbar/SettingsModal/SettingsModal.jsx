import React, { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import './SettingsModal.scss'
import Switch from 'react-switch'
import Modal from 'react-modal'
Modal.setAppElement('#root')

const SettingsModal = ({
  optionsModalOpen,
  setOptionsModalOpen,
  isColorBlind,
  setIsColorBlind,
}) => {
  const closeOptionsModal = () => {
    setOptionsModalOpen(false)
  }

  const [onColor, setOnColor] = useState('#eee')
  useEffect(() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      const hex = style.getPropertyValue('--correct-guess-color')
      setOnColor(hex.trim())
    }
  }, [isColorBlind])

  return (
    <Modal
      isOpen={optionsModalOpen}
      onRequestClose={closeOptionsModal}
      contentLabel='Example Modal'
      className='settings-modal modal'
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
        <h2>Settings</h2>
        <button className='close-modal-btn btn' onClick={closeOptionsModal}>
          <AiOutlineClose />
        </button>
        <div className='content'>
          <div className='setting'>
            <label>
              <Switch
                onChange={() => {
                  setIsColorBlind(!isColorBlind)
                }}
                checked={isColorBlind}
                onColor={onColor || '#eee'}
                uncheckedIcon={false}
                checkedIcon={false}
                handleDiameter={20}
                width={50}
              />
              <div className='text'>Colorblind mode</div>
            </label>
          </div>
        </div>
      </>
    </Modal>
  )
}

export default SettingsModal
