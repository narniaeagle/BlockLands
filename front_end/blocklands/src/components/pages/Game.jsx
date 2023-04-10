import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useParams } from 'react-router-dom'

export default function Game() {
  let [game, setGame] = useState({})
  let [pass, setPass] = useState([])
  let { game_id } = useParams()

  const [showDescription, setShowDescription] = useState(false)
  const [showStore, setShowStore] = useState(false)

  const handleDescriptionClick = () => {
    setShowDescription(true)
    setShowStore(false)
  }
  const handleStoreClick = () => {
    setShowStore(true)
    setShowDescription(false)
  }

  let {authTokens, logoutUser} = useContext(AuthContext)

  useEffect(() => {
    handleDescriptionClick()
    handleStoreClick()
    getGameDetail()
    getPassDetail()
  }, [])

  let getGameDetail = async () => {
    let response = await fetch(`http://127.0.0.1:8000/games/${game_id}`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    let data = await response.json()

    if (response.status === 200) {
      setGame(data)
    }
    else if(response.statusText === 'Unauthorized'){
    logoutUser()
    }
  }

  let getPassDetail = async () => {
    let response = await fetch(`http://127.0.0.1:8000/pass/`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    let data = await response.json()

    if (response.status === 200) {
      setPass(data)
    }
  }

  return (
    <div>
      <p>Game ID: {game_id}</p>
      <p>Game Name: {game.name}</p>
      <p>Game User: {game.user}</p>
      <img src={game.image} style={{ maxWidth: '100%', height: 'auto' }} alt={game.name} />
      <div>
        <button onClick={handleDescriptionClick}>Description</button>
        <button onClick={handleStoreClick}>Store</button>
      </div>
      <div>
        <p>Description: {game.description}</p>
        {pass.filter(pas => pas.game === `http://127.0.0.1:8000/games/${game_id}`).map(pas => (
  <div key={pas.id}>
    <p>Pass Name: {pas.name}</p>
    <img src={pass.img}></img>
    <p>Pass Price: {pas.price}</p>
  </div>
))}
      </div>
    </div>
  )
}
