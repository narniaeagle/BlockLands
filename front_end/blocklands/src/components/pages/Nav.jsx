import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Nav.css'
import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode"


export default function Nav () {
    let {user, authTokens, logoutUser} = useContext(AuthContext)
    let [userProfile, setUserProfile] = useState({})


    useEffect(() => {
        if(authTokens){
            getUserProfile()
        }
    }, [authTokens])
    
    let getUserProfile = async() => {
        try {
            const decodedToken = jwt_decode(authTokens.access) 
            
            const response = await fetch(`http://127.0.0.1:8000/users/${decodedToken.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            });
            const data = await response.json();
            console.log(data)

            if(response.status === 200){
                setUserProfile(data)
            }else if(response.statusText === 'Unauthorized'){
                logoutUser()
            }
        } catch(error) {
            console.error('Error adding coin:', error)
        }
    }

    return (
        <div>
            <div className='navbuttons'>
            <Link to='/' className='navbutton'>Discover</Link>
            <Link to='/create' className='navbutton'>Create</Link>
            <Link to='/avatar' className='navbutton'>Avatar</Link>

            {authTokens && <Link to='/profile' className='navbutton'>{user.username}</Link>}

            {authTokens ? (
                <>
                    <Link to='/coin' className='navbutton'>Coins: {userProfile.coins}</Link>
                    <Link to='/login' className='navbutton' onClick={logoutUser}>Logout </Link>
                </>
            ) : (
                <Link to='/login' className='navbutton'>Login</Link>
            )}
            </div>
        </div>
    )
}