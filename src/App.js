import React, { useState, useEffect } from 'react'
import Tridle from './Components/Tridle/Tridle'
import Navbar from './Components/Navbar/Navbar'
import ReactGA from 'react-ga'
// const TRACKING_ID = 'G-XKBYT553LJ'
// ReactGA.initialize(TRACKING_ID)

function App() {
  // useEffect(() => {
  //   ReactGA.pageview('Init page view')
  // }, [])

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
      <Tridle pageStats={ReactGA} />
    </div>
  )
}

export default App
