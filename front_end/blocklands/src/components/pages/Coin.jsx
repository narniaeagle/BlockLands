import '../styles/Discover.css'
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode"; // Import jwt_decode library

export default function Coin () {
    const {authTokens, logoutUser} = useContext(AuthContext) // Get authTokens and logoutUser from AuthContext
    const [games, setGames] = useState(null); // Define games state and setGames function

    let addCoin = async(coinValue) => { // Accept coinValue as parameter
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
            const currentCoins = getData.coins; // Get the current coins value from the response

            const sumCoins = parseInt(currentCoins) + coinValue; // Calculate the updated coins value

            // Make a PUT request to update the coins value in the database
            const putResponse = await fetch(`http://127.0.0.1:8000/users/${decodedToken.user_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({coins: sumCoins})
            });
            const putData = await putResponse.json();

            if(putResponse.status === 200){
                setGames(putData)
            }else if(putResponse.statusText === 'Unauthorized'){
                logoutUser()
            }
        } catch(error) {
            console.error('Error adding coin:', error)
        }
    }

    return (
        <div>
            <p>$4.99</p><button onClick={() => addCoin(500)}>500C</button> 
            <p>$9.99</p><button onClick={() => addCoin(1120)}>1120C</button> 
            <p>$19.99</p><button onClick={() => addCoin(2450)}>2450C</button> 
            <p>$49.99</p><button onClick={() => addCoin(5500)}>5500C</button> 
        </div>
    )
}
