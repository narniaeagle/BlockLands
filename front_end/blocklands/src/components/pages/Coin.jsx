import '../styles/Discover.css'
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode"

export default function Coin () {
    const {authTokens, logoutUser} = useContext(AuthContext) // Get authTokens and logoutUser from AuthContext

    let addCoin = async(coinValue) => { 
        try {
            const decodedToken = jwt_decode(authTokens.access) // Decode the access token to get user.id
            
            // Fetch the current coins value from the server
            const getResponse = await fetch(`http://127.0.0.1:8000/users/${decodedToken.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                }
            });
            const getData = await getResponse.json();
            const currentCoins = getData.coins;

            const sumCoins = parseInt(currentCoins) + coinValue; 

            // Make a PUT request to update the coins value in the database
            const putResponse = await fetch(`http://127.0.0.1:8000/users/${decodedToken.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({coins: sumCoins})
            });

            if(putResponse.statusText === 'Unauthorized'){
                logoutUser()
            }
        } catch(error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h2>BUY COIN</h2>
            <p>$4.99</p><button onClick={() => addCoin(500)}>500C</button> 
            <p>$9.99</p><button onClick={() => addCoin(1120)}>1120C</button> 
            <p>$19.99</p><button onClick={() => addCoin(2450)}>2450C</button> 
            <p>$49.99</p><button onClick={() => addCoin(5500)}>5500C</button> 
        </div>
    )
}
