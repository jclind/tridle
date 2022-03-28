import React, { useState } from 'react'
import './KeyBoard.scss'
import { FiDelete } from 'react-icons/fi'
import { BsArrowReturnLeft } from 'react-icons/bs'

const KeyBoard = ({ pastWords, addLetter, deleteLetter, submitWord }) => {
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
  return (
    <div className='keyboard-container'>
      <div className='row row-1'>
        <button
          className={`key btn ${letters.Q}`}
          onClick={() => addLetter('Q')}
        >
          q
        </button>
        <button
          className={`key btn ${letters.W}`}
          onClick={() => addLetter('W')}
        >
          w
        </button>
        <button
          className={`key btn ${letters.E}`}
          onClick={() => addLetter('E')}
        >
          e
        </button>
        <button
          className={`key btn ${letters.R}`}
          onClick={() => addLetter('R')}
        >
          r
        </button>
        <button
          className={`key btn ${letters.T}`}
          onClick={() => addLetter('T')}
        >
          t
        </button>
        <button
          className={`key btn ${letters.Y}`}
          onClick={() => addLetter('Y')}
        >
          y
        </button>
        <button
          className={`key btn ${letters.U}`}
          onClick={() => addLetter('U')}
        >
          u
        </button>
        <button
          className={`key btn ${letters.I}`}
          onClick={() => addLetter('I')}
        >
          i
        </button>
        <button
          className={`key btn ${letters.O}`}
          onClick={() => addLetter('O')}
        >
          o
        </button>
        <button
          className={`key btn ${letters.P}`}
          onClick={() => addLetter('P')}
        >
          p
        </button>
      </div>
      <div className='row row-2'>
        <button
          className={`key btn ${letters.A}`}
          onClick={() => addLetter('A')}
        >
          a
        </button>
        <button
          className={`key btn ${letters.S}`}
          onClick={() => addLetter('S')}
        >
          s
        </button>
        <button
          className={`key btn ${letters.D}`}
          onClick={() => addLetter('D')}
        >
          d
        </button>
        <button
          className={`key btn ${letters.F}`}
          onClick={() => addLetter('F')}
        >
          f
        </button>
        <button
          className={`key btn ${letters.G}`}
          onClick={() => addLetter('G')}
        >
          g
        </button>
        <button
          className={`key btn ${letters.H}`}
          onClick={() => addLetter('H')}
        >
          h
        </button>
        <button
          className={`key btn ${letters.J}`}
          onClick={() => addLetter('J')}
        >
          j
        </button>
        <button
          className={`key btn ${letters.K}`}
          onClick={() => addLetter('K')}
        >
          k
        </button>
        <button
          className={`key btn ${letters.L}`}
          onClick={() => addLetter('L')}
        >
          l
        </button>
      </div>
      <div className='row row-3'>
        <button className='key btn enter' onClick={submitWord}>
          <BsArrowReturnLeft className='icon' />
        </button>
        <button
          className={`key btn ${letters.Z}`}
          onClick={() => addLetter('Z')}
        >
          z
        </button>
        <button
          className={`key btn ${letters.X}`}
          onClick={() => addLetter('X')}
        >
          x
        </button>
        <button
          className={`key btn ${letters.C}`}
          onClick={() => addLetter('C')}
        >
          c
        </button>
        <button
          className={`key btn ${letters.V}`}
          onClick={() => addLetter('V')}
        >
          v
        </button>
        <button
          className={`key btn ${letters.B}`}
          onClick={() => addLetter('B')}
        >
          b
        </button>
        <button
          className={`key btn ${letters.N}`}
          onClick={() => addLetter('N')}
        >
          n
        </button>
        <button
          className={`key btn ${letters.M}`}
          onClick={() => addLetter('M')}
        >
          m
        </button>
        <button className='key delete btn' onClick={deleteLetter}>
          <FiDelete className='icon' />
        </button>
      </div>
    </div>
  )
}

export default KeyBoard
