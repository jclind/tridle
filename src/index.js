import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import 'normalize.css'
import './index.scss'
import './themes.scss'
import ReactGA from 'react-ga'
const TRACKING_ID = 'G-XKBYT553LJ'
ReactGA.initialize(TRACKING_ID)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
