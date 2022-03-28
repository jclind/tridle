import React from 'react'
import { BsMoonStars, BsSun, BsCircle } from 'react-icons/bs'

const ToggleTheme = ({ isDark, setIsDark }) => {
  return (
    <button
      className='light-dark-toggle-btn btn'
      onClick={() => setIsDark(!isDark)}
    >
      <BsCircle
        className={isDark ? 'icon circle-icon dark' : 'icon circle-icon light'}
      />
      <BsMoonStars
        className={
          isDark
            ? 'icon indicator-icon dark toggle'
            : 'icon indicator-icon dark'
        }
      />
      <BsSun
        className={
          !isDark
            ? 'icon indicator-icon light toggle'
            : 'icon indicator-icon light'
        }
      />
    </button>
  )
}

export default ToggleTheme
