import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { App } from './App'
import './styles.css'

const el = document.getElementById('root')
if (el) {
  const app = (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  if (el.firstChild) {
    hydrateRoot(el, app)
  } else {
    createRoot(el).render(app)
  }
}
