import '../styles/Discover.css'

 

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { useNavigate } from "react-router-dom"


export default function Discover () {
    let [games, setGames] = useState([])
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        getDetail()
    }, [])

    let navigate = useNavigate()


    let getDetail = async() =>{
        let response = await fetch('http://127.0.0.1:8000/games/', {
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
            <p>You are logged to the home page!</p>

            <div className='grid'>
                    {games.map(game => (
                        <div key={game.id} className='space-between' onClick={() => GameDetail(game)} >
                            <div>{game.user} {game.name} <img src={game.image} style={{ maxWidth:'100%', height:'auto'}}></img></div>
                        </div>
                    ))}
            </div>
        </div>
    )
}
