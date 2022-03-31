import React from 'react'
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
    // If the current row is selected and currWord[i] exists, currWord[i] is the current letter
    if (isSelected && currWord[i]) {
      currLetter = currWord[i]
    } else if (pastWord) {
      // If the row is not selected and past word exists, the current letter is the current letter in pastWord at index i
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
      // If the current word is not valid, the current row is selected, and current word length is equal to LTRS_IN_WORD, turn text red
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
