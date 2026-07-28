import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { JobsProvider } from './context/JobsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <JobsProvider>
      <App />
    </JobsProvider>
  </AuthProvider>
)