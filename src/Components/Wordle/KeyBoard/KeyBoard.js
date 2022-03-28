import React, { useState } from 'react'
import './KeyBoard.scss'
import { FiDelete } from 'react-icons/fi'

const KeyBoard = ({ pastWords }) => {
  const letters = {}
  pastWords.forEach(el => {
    el.words.forEach(word => {
      console.log(letters, word.letter, letters[word.letter])
      if (letters && letters[word.letter] === 'eq') {
        return
      }
      console.log(word.letter)
      letters[word.letter] = word.position
    })
  })
  console.log(letters)
  return (
    <div className='keyboard-container'>
      <div className='row row-1'>
        <div className={`key ${letters.Q}`}>q</div>
        <div className={`key ${letters.W}`}>w</div>
        <div className={`key ${letters.E}`}>e</div>
        <div className={`key ${letters.R}`}>r</div>
        <div className={`key ${letters.T}`}>t</div>
        <div className={`key ${letters.Y}`}>y</div>
        <div className={`key ${letters.U}`}>u</div>
        <div className={`key ${letters.I}`}>i</div>
        <div className={`key ${letters.O}`}>o</div>
        <div className={`key ${letters.P}`}>p</div>
      </div>
      <div className='row row-2'>
        <div className={`key ${letters.A}`}>a</div>
        <div className={`key ${letters.S}`}>s</div>
        <div className={`key ${letters.D}`}>d</div>
        <div className={`key ${letters.F}`}>f</div>
        <div className={`key ${letters.G}`}>g</div>
        <div className={`key ${letters.H}`}>h</div>
        <div className={`key ${letters.J}`}>j</div>
        <div className={`key ${letters.K}`}>k</div>
        <div className={`key ${letters.L}`}>l</div>
      </div>
      <div className='row row-3'>
        <div className='key enter'>ENTER</div>
        <div className={`key ${letters.Z}`}>z</div>
        <div className={`key ${letters.X}`}>x</div>
        <div className={`key ${letters.C}`}>c</div>
        <div className={`key ${letters.V}`}>v</div>
        <div className={`key ${letters.B}`}>b</div>
        <div className={`key ${letters.N}`}>n</div>
        <div className={`key ${letters.M}`}>m</div>
        <div className='key'>
          <FiDelete />
        </div>
      </div>
    </div>
  )
}

export default KeyBoard
