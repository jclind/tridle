import React, { useState, useEffect } from 'react'
import Wordle from './Components/Wordle/Wordle'
import Navbar from './Components/Navbar/Navbar'

function App() {
  const localSettings = JSON.parse(localStorage.getItem('settings'))
  console.log(localSettings)
  const [isDark, setIsDark] = useState(() => {
    if (localSettings) {
      console.log('here?', localSettings.isDark)
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
    console.log(1)
    if (data) {
      console.log(2)
      if (data.isDark !== isDark || data.isColorBlind !== isColorBlind) {
        console.log(3, isDark, isColorBlind)
        const settingsData = {
          isDark,
          isColorBlind,
        }
        localStorage.setItem('settings', JSON.stringify(settingsData))
      }
    } else {
      console.log(4)
      const settingsData = {
        isDark,
        isColorBlind,
      }
      localStorage.setItem('settings', JSON.stringify(settingsData))
    }
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
