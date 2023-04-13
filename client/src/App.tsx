import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'

import NavBar from './components/Navbar'
import Home from './pages/home'
import ViewSingle from './pages/viewSingle'
import SignUpLoginForm from './components/signUpLoginForm'
import { useAuthContext } from './context/authContext'
import * as userApi from './network/postApi'

function App() {

  const { showSignUp, showLogin, setUser} = useAuthContext()


  return (
    <>
      <NavBar />

      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<ViewSingle />} />
        </Routes>
      </Container>

      {
        showSignUp &&
        <SignUpLoginForm/>
      }

      {
        showLogin &&
        <SignUpLoginForm/>
      }
    </>
  )
}

export default App
