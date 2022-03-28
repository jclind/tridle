import React, { useState } from 'react'
import { BsFillMoonStarsFill, BsFillSunFill } from 'react-icons/bs'
const Navbar = () => {
  const [isDark, setIsDark] = useState(true)
  return (
    <nav className='nav'>
      <div className='nav-center'>
        <div className='nav-header'></div>
        <div className='nav-content'>
          <button
            className='light-dark-toggle-btn btn'
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? (
              <BsFillMoonStarsFill className='icon dark' />
            ) : (
              <BsFillSunFill className='icon light' />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
