import React, { useState, useEffect } from 'react'
import Wordle from './Components/Wordle/Wordle'
import Navbar from './Components/Navbar/Navbar'

function App() {
  const localSettings = JSON.parse(localStorage.getItem('settings'))
  const [isDark, setIsDark] = useState(() => {
    if (localSettings) {
      return localSettings.isDark
    }
    return true
  })
  const [isColorBlind, setIsColorBlind] = useState(() => {
    if (localSettings) {
      return localSettings.isColorBlind
    }
    return false
  })

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('settings'))
    if (data) {
      if (data.isDark !== isDark || data.isColorBlind !== isColorBlind) {
        const settingsData = {
          isDark,
          isColorBlind,
        }
        localStorage.setItem('settings', JSON.stringify(settingsData))
      }
    } else {
      const settingsData = {
        isDark,
        isColorBlind,
      }
      localStorage.setItem('settings', JSON.stringify(settingsData))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, isColorBlind])

  return (
    <div
      className={
        'app ' +
        (isDark ? 'dark-theme ' : '') +
        (isColorBlind ? 'color-blind' : '')
      }
    >
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        isColorBlind={isColorBlind}
        setIsColorBlind={setIsColorBlind}
      />
      <Wordle />
    </div>
  )
}

export default App
