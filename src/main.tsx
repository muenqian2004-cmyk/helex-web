import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getStoredTheme, applyTheme } from './components/ThemeDialog'

// Apply stored theme before first render to prevent flash
applyTheme(getStoredTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
