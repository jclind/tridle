import React, { useState } from 'react'
import Wordle from './Components/Wordle/Wordle'
import Navbar from './Components/Navbar/Navbar'

function App() {
  const [isDark, setIsDark] = useState(true)
  return (
    <div className={isDark ? 'app dark-theme' : 'app'}>
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <Wordle />
    </div>
  )
}

export default App
