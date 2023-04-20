import '../styles/Discover.css'
import {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import jwt_decode from "jwt-decode"
import { BASE_URL } from '../context/Url';

export default function Coin () {
    const {authTokens, logoutUser} = useContext(AuthContext) // Get authTokens and logoutUser from AuthContext

    let addCoin = async(coinValue) => { 
        try {
            const decodedToken = jwt_decode(authTokens.access) // Decode the access token to get user.id
            
            // Fetch the current coins value from the server
            const getResponse = await fetch(`${BASE_URL}users/${decodedToken.id}`, {
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
            const putResponse = await fetch(`${BASE_URL}users/${decodedToken.id}`, {
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
        <h2 className="text-center bg-info text-white p-3">BUY COIN</h2>
        <table className="table table-bordered table-dark table-hover text-center">
            <thead className="bg-dark text-white">
                <tr>
                    <th scope="col">Price ($)</th>
                    <th scope="col">Coins</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>$4.99</td>
                    <td><button className="btn btn-primary mx-auto" onClick={() => addCoin(500)}>500C</button></td>
                </tr>
                <tr>
                    <td>$9.99</td>
                    <td><button className="btn btn-primary mx-auto" onClick={() => addCoin(1120)}>1120C</button></td>
                </tr>
                <tr>
                    <td>$19.99</td>
                    <td><button className="btn btn-primary mx-auto" onClick={() => addCoin(2450)}>2450C</button></td>
                </tr>
                <tr>
                    <td>$49.99</td>
                    <td><button className="btn btn-primary mx-auto" onClick={() => addCoin(5500)}>5500C</button></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    )
}
