import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


import { Link } from 'react-router-dom'; 
import React, { useState, useEffect, useContext } from 'react'
import '../styles/Nav.css'
import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode"

export default function Navigation () {
    let {user, authTokens, logoutUser} = useContext(AuthContext)
    let [userProfile, setUserProfile] = useState({})

    useEffect(() => {
        if(authTokens){
            getUserProfile()
        }
    }, [authTokens])
    
    let getUserProfile = async() => {
        try {
            const decodedToken = jwt_decode(authTokens.access); 
          
            // Fetch the list of users
            const usersResponse = await fetch('http://127.0.0.1:8000/users', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
              }
            });
            const usersData = await usersResponse.json();

            // Find the user with matching user attribute
            const userProfile = usersData.find(user => user.user === `http://127.0.0.1:8000/auth/users/${decodedToken.user_id}`);

            
              const response = await fetch(`http://127.0.0.1:8000/users/${userProfile.id}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + String(authTokens.access)
                }
              });
              const userData = await response.json();
              console.log(userData);
          
              if (response.status === 200) {
                setUserProfile(userData);
              } else if (response.statusText === 'Unauthorized') {
                logoutUser();
              }

          } catch(error) {
            console.error('Error fetching user data:', error);
          }
    }

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Link to="/" className="navbar-brand">Blocklands</Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                {authTokens ? (
                  <>
                    <Nav className="me-auto">
                        <Link to="/" className="nav-link">Discover</Link>
                        <Link to="/avatar" className="nav-link">Avatar</Link>
                        <Link to="/create" className="nav-link">Create</Link>
                        <Link to="/mygames" className="nav-link">My Games</Link>
                    </Nav>
                    <Nav>
                        <Link to="/coin" className="nav-link">Coins: {userProfile.coins}</Link>
                        <div className="nav-link">{user.username}</div>
                        <Link to="/login" className="nav-link" onClick={logoutUser}>Logout</Link>
                    </Nav>
                    </>
                         ) : (
                          <Nav>
                              <Link to='/login' className="nav-link">Login</Link>
                              <Link to='/register' className="nav-link">Register</Link>
                          </Nav>
                           )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}


{/* <div>
            <div className='navbuttons'>
            <Link to='/' className='navbutton'>Discover</Link>
            <Link to='/avatar' className='navbutton'>Avatar</Link>
            <Link to='/create' className='navbutton'>Create</Link>

            {authTokens ? (
                <>
                    <Link to='/mygames' className='navbutton'>My Games</Link>
                    <div className='navbutton'>{user.username}</div>
                    <Link to='/coin' className='navbutton'>Coins: {userProfile.coins}</Link>
                    <Link to='/login' className='navbutton' onClick={logoutUser}>Logout </Link>
                </>
            ) : (
                <>
                <Link to='/login' className='navbutton'>Login</Link>
                <Link to='/register' className='navbutton'>Register</Link>
                </>
            )}
            </div>
        </div> */}