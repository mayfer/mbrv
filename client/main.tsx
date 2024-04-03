import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// @ts-ignore
const initial_state = window.__INITIAL_STATE__

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App greeting={initial_state.greeting} />
  </React.StrictMode>,
)
