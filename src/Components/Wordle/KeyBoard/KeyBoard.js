import React, { useState } from 'react'
import './KeyBoard.scss'
import { FiDelete } from 'react-icons/fi'

const KeyBoard = ({ pastWords }) => {
  const letters = [{ ltr: '' }]
  return (
    <div className='keyboard-container'>
      <div className='row row-1'>
        <div className='key'>q</div>
        <div className='key'>w</div>
        <div className='key'>e</div>
        <div className='key'>r</div>
        <div className='key'>t</div>
        <div className='key'>y</div>
        <div className='key'>u</div>
        <div className='key'>i</div>
        <div className='key'>o</div>
        <div className='key'>p</div>
      </div>
      <div className='row row-2'>
        <div className='key'>a</div>
        <div className='key'>s</div>
        <div className='key'>d</div>
        <div className='key'>f</div>
        <div className='key'>g</div>
        <div className='key'>h</div>
        <div className='key'>j</div>
        <div className='key'>k</div>
        <div className='key'>l</div>
      </div>
      <div className='row row-3'>
        <div className='key enter'>ENTER</div>
        <div className='key'>z</div>
        <div className='key'>x</div>
        <div className='key'>c</div>
        <div className='key'>v</div>
        <div className='key'>b</div>
        <div className='key'>n</div>
        <div className='key'>m</div>
        <div className='key'>
          <FiDelete />
        </div>
      </div>
    </div>
  )
}

export default KeyBoard
