import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useParams } from 'react-router-dom'
import jwt_decode from "jwt-decode"

export default function Game() {
  let [user, setUser] = useState({})
  let [game, setGame] = useState({})
  let [pass, setPass] = useState([])
  let [userPass, setUserPass] = useState([])
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
    

          if (userProfileResponse.statusText === 'Unauthorized') {
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
    getUserPass()
  }, [])



  let getPassDetail = async () => {
    try {
    let response = await fetch(`http://127.0.0.1:8000/pass/`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    let data = await response.json()

    if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
    else{
      setPass(data)
    }
  }catch(error) {
    console.error(error)
}
  }


  let getUserPass = async () => {
    try {
    let response = await fetch(`http://127.0.0.1:8000/userpass/`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    let data = await response.json()

    if (response.statusText === 'Unauthorized') {
      logoutUser();
    }
    else{
      setUserPass(data)
    }
  }catch(error) {
    console.error(error)
}
  }

  let buyPass = async (price, pass_id) => {
    try {
    const decodedToken = jwt_decode(authTokens.access) 

    //get the coins from userprofile
    let response = await fetch(`http://127.0.0.1:8000/users/${decodedToken.user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
    })
    if (response.statusText === 'Unauthorized') {
      logoutUser();
    }

    let data = await response.json()
    let coins = parseInt(data.coins)
    let total = coins - price


      //update the coins on the userprofile
      response = await fetch(`http://127.0.0.1:8000/users/${decodedToken.user_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({coins: total})
    })
      //add pass to the userpass table
    response = await fetch(`http://127.0.0.1:8000/userpass/`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authTokens.access)
      },
      body: JSON.stringify({user: `http://127.0.0.1:8000/users/${decodedToken.user_id}`,
      passs: `http://localhost:8000/pass/${pass_id}`
    })
    
    })

  }
  catch(error) {
    console.error(error)
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
              {/* checks the userpass table's pass attribute is same as the id of the list we are mapping through right now */}
              {userPass.filter((upas) => upas.passs === `http://127.0.0.1:8000/pass/${pas.id}`).length === 0 ? (
              <button onClick={() => buyPass(pas.price, pas.id)}>Pass Price: {pas.price}</button>
              ) : (
                <h1>Owned.</h1>
              )}
            </div>
          ))
        )}
         
        </div>
      )}
    </div>
  );
};






