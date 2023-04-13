import React from 'react'
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { Link } from 'react-router-dom'
import { useAuthContext } from '../context/authContext'

import * as userApi from '../network/postApi'

export default function NavBar() {

  const { user, onLogoutSuccess, signUpClick, loginClick } = useAuthContext()

  async function logout() {
    try {
      await userApi.logout()
      onLogoutSuccess()
    }
    catch(error){
      console.log(error)
    }
  }


  return (
    <>

      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>BLOG</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to='/'>Home</Nav.Link>
            </Nav>
            <Nav>
              {
                user 
                ?
                  <>
                    <Navbar.Text className="me-2">
                      Signed in as: {user.username}
                    </Navbar.Text>
                    <Button onClick={logout}>Log out</Button>
                  </> 
                :
                  <>
                    <Button onClick={signUpClick} className='me-1'>Sign Up</Button>
                    <Button onClick={loginClick}>Log In</Button>
                  </>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>



      {/* <NavbarBS>
            <Container>
                <Nav>
                <Nav.Link as={Link} to="/">HOME</Nav.Link> 
                </Nav> 
            </Container>
        </NavbarBS> */}
    </>
  )
}
