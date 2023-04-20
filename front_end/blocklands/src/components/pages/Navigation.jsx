import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


import { Link } from 'react-router-dom'; 
import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode"
import { BASE_URL } from '../context/Url';

export default function Navigation () {
    let {user, authTokens, logoutUser} = useContext(AuthContext)
    let [userProfile, setUserProfile] = useState({})

    useEffect(() => {
        if(authTokens){
            getUserProfile()
        }
    }, [authTokens, getUserProfile])
    
    let getUserProfile = async() => {
        try {
            const decodedToken = jwt_decode(authTokens.access); 
          
            // Fetch the list of users
            const usersResponse = await fetch(`${BASE_URL}users`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
              }
            });
            const usersData = await usersResponse.json();
            // Find the user with matching user attribute
            const userProfile = usersData.find(user => user.user === `${BASE_URL}auth/users/${decodedToken.user_id}`);

          
              if (usersResponse.status === 200) {
                setUserProfile(userProfile);
              } else if (usersResponse.statusText === 'Unauthorized') {
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