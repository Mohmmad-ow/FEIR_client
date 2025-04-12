import './assets/index.css'
// import './assets/main.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {AuthProvider} from '../context/AuthContextProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)
