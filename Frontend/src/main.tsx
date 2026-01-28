import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { SaaSErrorBoundary, initSentry } from './saas'

// Initialize Monitoring
initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SaaSErrorBoundary>
      <App />
    </SaaSErrorBoundary>
  </React.StrictMode>,
)
