import React, { useEffect } from 'react'
import './WordleRow.scss'

const WordleTile = ({ letter, position }) => {
  return (
    <div className={position ? `${position} wordle-tile` : `wordle-tile`}>
      {letter}
    </div>
  )
}

const WordleRow = ({
  isSelected,
  currWord,
  pastWord,
  currWordValid,
  LTRS_IN_WORD,
}) => {
  const letters = []
  for (let i = 0; i <= LTRS_IN_WORD - 1; i++) {
    let currLetter = ''
    let currWordPosition = ''
    if (isSelected && currWord[i]) {
      currLetter = currWord[i]
    } else if (pastWord) {
      currLetter = pastWord.words[i].letter
      currWordPosition = pastWord.words[i].position
    }
    letters.push(
      <WordleTile
        key={i}
        letter={currLetter}
        position={currWordPosition}
        currWordValid
      />
    )
  }
  return (
    <div
      className={
        !currWordValid && isSelected && currWord.length === LTRS_IN_WORD
          ? 'wordle-row invalid'
          : 'wordle-row'
      }
    >
      {letters}
    </div>
  )
}

export default WordleRow
