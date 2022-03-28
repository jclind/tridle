import React, { useState } from 'react'
import ToggleTheme from './ToggleTheme'
import './Navbar.scss'
import {
  AiOutlineInfoCircle,
  AiOutlineHeart,
  AiOutlineSetting,
} from 'react-icons/ai'

const Navbar = ({ isDark, setIsDark }) => {
  return (
    <nav className='nav'>
      <div className='nav-center'>
        <div className='nav-left'>
          <button className='btn nav-btn info'>
            <AiOutlineInfoCircle className='icon nav-icon' />
          </button>
          <button className='btn nav-btn support'>
            <AiOutlineHeart className='icon nav-icon' />
          </button>
        </div>
        <div className='nav-middle'>
          <h1 className='title'>WORDLE</h1>
        </div>
        <div className='nav-right'>
          <ToggleTheme isDark={isDark} setIsDark={setIsDark} />
          <button className='btn nav-btn settings'>
            <AiOutlineSetting className='settings-icon nav-icon' />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
