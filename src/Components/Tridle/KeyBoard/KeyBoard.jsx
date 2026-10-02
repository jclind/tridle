import './KeyBoard.scss'
import { FiDelete } from 'react-icons/fi'
import { BsArrowReturnLeft } from 'react-icons/bs'

const KeyBoard = ({ pastWords, addLetter, deleteLetter, submitWord }) => {
  // A key shows the best state its letter has had in any guess: a grey tile
  // from a repeated letter must not hide a yellow or green one.
  const rank = { nin: 1, in: 2, eq: 3 }
  const letters = {}
  pastWords.forEach(el => {
    el.words.forEach(word => {
      const prev = letters[word.letter]
      if (!prev || rank[word.position] > rank[prev]) {
        letters[word.letter] = word.position
      }
    })
  })
  const keyClass = letter =>
    letters[letter] ? `key btn ${letters[letter]}` : 'key btn'
  return (
    <div className='keyboard-container'>
      <div className='row row-1'>
        <button
          className={keyClass('Q')}
          onClick={() => addLetter('Q')}
        >
          q
        </button>
        <button
          className={keyClass('W')}
          onClick={() => addLetter('W')}
        >
          w
        </button>
        <button
          className={keyClass('E')}
          onClick={() => addLetter('E')}
        >
          e
        </button>
        <button
          className={keyClass('R')}
          onClick={() => addLetter('R')}
        >
          r
        </button>
        <button
          className={keyClass('T')}
          onClick={() => addLetter('T')}
        >
          t
        </button>
        <button
          className={keyClass('Y')}
          onClick={() => addLetter('Y')}
        >
          y
        </button>
        <button
          className={keyClass('U')}
          onClick={() => addLetter('U')}
        >
          u
        </button>
        <button
          className={keyClass('I')}
          onClick={() => addLetter('I')}
        >
          i
        </button>
        <button
          className={keyClass('O')}
          onClick={() => addLetter('O')}
        >
          o
        </button>
        <button
          className={keyClass('P')}
          onClick={() => addLetter('P')}
        >
          p
        </button>
      </div>
      <div className='row row-2'>
        <button
          className={keyClass('A')}
          onClick={() => addLetter('A')}
        >
          a
        </button>
        <button
          className={keyClass('S')}
          onClick={() => addLetter('S')}
        >
          s
        </button>
        <button
          className={keyClass('D')}
          onClick={() => addLetter('D')}
        >
          d
        </button>
        <button
          className={keyClass('F')}
          onClick={() => addLetter('F')}
        >
          f
        </button>
        <button
          className={keyClass('G')}
          onClick={() => addLetter('G')}
        >
          g
        </button>
        <button
          className={keyClass('H')}
          onClick={() => addLetter('H')}
        >
          h
        </button>
        <button
          className={keyClass('J')}
          onClick={() => addLetter('J')}
        >
          j
        </button>
        <button
          className={keyClass('K')}
          onClick={() => addLetter('K')}
        >
          k
        </button>
        <button
          className={keyClass('L')}
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
          className={keyClass('Z')}
          onClick={() => addLetter('Z')}
        >
          z
        </button>
        <button
          className={keyClass('X')}
          onClick={() => addLetter('X')}
        >
          x
        </button>
        <button
          className={keyClass('C')}
          onClick={() => addLetter('C')}
        >
          c
        </button>
        <button
          className={keyClass('V')}
          onClick={() => addLetter('V')}
        >
          v
        </button>
        <button
          className={keyClass('B')}
          onClick={() => addLetter('B')}
        >
          b
        </button>
        <button
          className={keyClass('N')}
          onClick={() => addLetter('N')}
        >
          n
        </button>
        <button
          className={keyClass('M')}
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
