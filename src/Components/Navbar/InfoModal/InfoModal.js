import React from 'react'
import { AiOutlineClose, AiFillGithub } from 'react-icons/ai'
import { BsArrowRightShort } from 'react-icons/bs'
import { BiGitBranch } from 'react-icons/bi'
import { SiBuymeacoffee } from 'react-icons/si'
import './InfoModal.scss'
import Modal from 'react-modal'
Modal.setAppElement('#root')

const InfoModal = ({ infoModalOpen, setInfoModalOpen }) => {
  const closeInfoModal = () => {
    setInfoModalOpen(false)
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
  const tertiaryText = (() => {
    if (document.querySelector('.app')) {
      const style = getComputedStyle(document.querySelector('.app'))
      return style.getPropertyValue('--tertiary-text')
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
      isOpen={infoModalOpen}
      onRequestClose={closeInfoModal}
      contentLabel='Example Modal'
      className='info-modal modal'
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
      <button className='close-modal-btn btn' onClick={closeInfoModal}>
        <AiOutlineClose />
      </button>
      <div className='modal-content'>
        <h2>
          Solve the three letter word in{' '}
          <span className='green' style={{ color: correctGuess }}>
            8
          </span>{' '}
          tries.
        </h2>
        <div className='text'>
          The same rules as{' '}
          <a
            href='https://www.nytimes.com/games/wordle/index.html'
            className='wordle-link'
          >
            WORDLE
          </a>{' '}
          apply, you just need to guess a three letter word instead of a five
          letter one. You know how to play from there ;)
        </div>
        <div className='text'>A new Tridle will be available every day!</div>

        <div
          className='author'
          style={{
            color: secondaryText,
            borderTop: `1px solid ${tertiaryText}`,
          }}
        >
          Created by <a href='https://www.jesselind.com/'>Jesse Lind</a>
        </div>
        <div className='support-container'>
          <a
            href='https://www.buymeacoffee.com/jesseclind'
            className='support'
            style={{ color: primaryBackground }}
          >
            <SiBuymeacoffee className='icon' /> Support me :){' '}
            <BsArrowRightShort className='arrow-icon icon' />
          </a>
        </div>
        <div className='footer-text'>
          <a
            href='https://github.com/jclind/tridle'
            style={{
              color: tertiaryText,
            }}
            className='github'
          >
            <AiFillGithub className='icon' /> Github
          </a>
          <div
            className='version'
            style={{
              color: tertiaryText,
            }}
          >
            <BiGitBranch className='icon' />
            v-1.1.1
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default InfoModal
