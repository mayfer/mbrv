import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// @ts-ignore
const initial_state = window.__INITIAL_STATE__

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App greeting={initial_state.greeting} />
)
