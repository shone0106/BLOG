import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App'
import { PostContextProvider } from './context/postContext'
import { AuthContextProvider } from './context/authContext'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <PostContextProvider>
            <App />
        </PostContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)
