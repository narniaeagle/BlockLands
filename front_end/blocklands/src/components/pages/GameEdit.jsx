import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useParams } from 'react-router-dom'

export default function GameEdit() {
  let [user, setUser] = useState({})
  let [user_profile, setUserProfile] = useState({})
  let [game, setGame] = useState({})
  let [pass, setPass] = useState([])
  let { game_id } = useParams()

  const [showDescription, setShowDescription] = useState(true)
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
    const fetchData = async () => {
        try {
          // Fetch game data
          const gameResponse = await fetch(`http://127.0.0.1:8000/games/${game_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + String(authTokens.access)
            },
          });
          const gameData = await gameResponse.json();
    
          if (gameResponse.status === 200) {
            setGame(gameData);
          } else if (gameResponse.statusText === 'Unauthorized') {
            logoutUser();
          }
    
          // Fetch userprofile data
          const userProfileResponse = await fetch(gameData.user, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + String(authTokens.access)
            },
          });
          const userProfileData = await userProfileResponse.json();
    
          if (userProfileResponse.status === 200) {
            setUserProfile(userProfileData);
          }
          else if (userProfileResponse.statusText === 'Unauthorized') {
            logoutUser();
          }


             // Fetch user data
             const userResponse = await fetch(userProfileData.user, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + String(authTokens.access)
                },
              });
              const userData = await userResponse.json();
        
              if (userResponse.status === 200) {
                setUser(userData);
              }
              else if (gameResponse.statusText === 'Unauthorized') {
                logoutUser();
              }

        } catch (error) {
            console.log(error)
        }
      };
    
    fetchData()
    getPassDetail()
  }, [])


//GameEdit page is going to be nearly same as the Game page but going to include Edit buttons if the logged in user's id matches with
//the game's created by: part. (I wanted to seperate the from discover so, even the owner of the game would see how all the users sees)
//This page going to include edit and delete.
//4/5 (Editing passes)

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
      <p>Created By: {user.username}</p>
      <img src={game.image} style={{ maxWidth: '100%', height: 'auto' }} alt={game.name} />
      <button>PLAY</button>
      <div>
        <button onClick={handleDescriptionClick}>Description</button>
        <button onClick={handleStoreClick}>Store</button>
      </div>
      {showDescription && (
          <p>Description: {game.description}</p>
          )}
                {showStore && (
        <div>
            {pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).length === 0 ? (
            <p>No passes available.</p>
          ) : (
          pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).map((pas) => (
            <div key={pas.id}>
              <p>Pass Name: {pas.name}</p>
              <p>Pass Description: {pas.description}</p>
              <img src={pas.image}></img>
              <button>Pass Price: {pas.price}</button>
            </div>
          ))
        )}
         
        </div>
      )}
    </div>
  );
};






