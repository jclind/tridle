import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// react-modal is pointed at '#root' (Modal.setAppElement('#root') in the
// components), so give jsdom that element before anything renders.
if (!document.getElementById('root')) {
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)
}

afterEach(() => {
  cleanup()
  localStorage.clear()
})
