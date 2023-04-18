import '../styles/Discover.css'

 

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from "react-router-dom"
import { BASE_URL } from '../context/Url';


export default function Discover () {
    let [games, setGames] = useState([])
    let {user, authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getDetail()
    }, [])

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
        navigate (`/game/edit/${game.id}`)
      }

    return (
        <div>
            <h2>MY GAMES</h2>
            <div className='grid'>
            {games.filter((game) => game.user === `${BASE_URL}users/${user.id}`).map((game) => (
                        <div key={game.id} className='space-between' onClick={() => GameDetail(game)} >
                            <div> {game.name} <img src={game.image} style={{ maxWidth:'100%', height:'auto'}}></img></div>
                        </div>
                     ))}
            </div>
        </div>
    )
}
