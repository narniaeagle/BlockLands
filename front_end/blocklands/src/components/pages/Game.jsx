import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import jwt_decode from "jwt-decode"

export default function Game() {
  let [authUser, setAuthUser] = useState({})
  let [game, setGame] = useState({})
  let [pass, setPass] = useState([])
  let [userPass, setUserPass] = useState([])
  let { game_id } = useParams()
  const navigate = useNavigate()

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

  let {authTokens, logoutUser, user} = useContext(AuthContext)

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
                setAuthUser(userData);
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
    let response = await fetch(`http://127.0.0.1:8000/users/${decodedToken.id}`, {
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

    if(total>= 0){
      //update the coins on the userprofile
      response = await fetch(`http://127.0.0.1:8000/users/${decodedToken.id}`, {
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
      body: JSON.stringify({user: `http://127.0.0.1:8000/users/${decodedToken.id}`,
      passs: `http://localhost:8000/pass/${pass_id}`
    })
    
    })

    getUserPass()
  }
  else{
    navigate('/coin')
  }
  }
  catch(error) {
    console.error(error)
}
  }

  return (
    <div className="container mx-0">
        <div className="row">
      <div className="col-md-6">
        <p>Game ID: {game_id}</p>
        <p>Game Name: {game.name}</p>
        <p>Created By: {authUser.username}</p>
        <div className="d-flex">
          <img src={game.image} className="img-fluid mr-3" alt={game.name} />
          <button className="btn btn-primary align-self-center">PLAY</button>
        </div>
      </div>
    </div>

  
      <div className="btn-group" data-toggle="buttons" role="group" aria-label="btn-group">
        <button onClick={handleDescriptionClick} type="button" className={`btn btn-secondary ${showDescription ? 'active' : ''}`}>
          Description
        </button>
        <button onClick={handleStoreClick} type="button" className={`btn btn-secondary ${showStore ? 'active' : ''}`}>
          Store
        </button>
      </div>
  
      {showDescription && (
        <p>{game.description}</p>
      )}
{showStore && (
    <div>
        {pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).length === 0 ? (
            <p>No passes available.</p>
        ) : (
            <div className="row">
                {pass
                    .filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`)
                    .map((pas) => (
                        <div key={pas.id} className="col-md-4 mb-4">
                            <div className="card">
                                <img src={pas.image} className="card-img-top" alt={pas.name} style={{ maxHeight: '150px' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{pas.name}</h5>
                                    <p className="card-text">{pas.description}</p>
                                    {userPass
                                        .filter(
                                            (upas) => upas.passs === `http://127.0.0.1:8000/pass/${pas.id}` && upas.user === `http://127.0.0.1:8000/users/${user.id}`
                                        )
                                        .length === 0 ? (
                                        <button onClick={() => buyPass(pas.price, pas.id)} className="btn btn-primary">
                                            Pass Price: {pas.price}
                                        </button>
                                    ) : (
                                        <h6 className="text-success mt-3">Owned.</h6>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        )}
    </div>
)}

</div>
  );
  
};






