import '../styles/Discover.css'

 

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from "react-router-dom"
import { BASE_URL } from '../context/Url';

export default function Discover () {
    let [games, setGames] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getDetail()
    }, [getDetail])

    let navigate = useNavigate()


    let getDetail = async() =>{
        let response = await fetch(`${BASE_URL}games/`, {
            method:'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authTokens.access)
            }
        })
        let data = await response.json()

        if(response.status === 200){
            setGames(data)
        }else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
        
    }

    const GameDetail = (game) => {
        navigate (`/game/${game.id}`)
      }

    return (
        <div>
            <h2>DISCOVER</h2>
            <div className='grid'>
                    {games.map(game => (
                        <div key={game.id} className='space-between' onClick={() => GameDetail(game)} >
                            <div> {game.name} <img src={game.image} alt={game.name} style={{ maxWidth:'100%', height:'auto'}}></img></div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
