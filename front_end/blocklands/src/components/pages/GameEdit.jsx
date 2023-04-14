import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useParams } from 'react-router-dom'

export default function GameEdit() {
  let {authTokens, logoutUser, user} = useContext(AuthContext)
  let [authUser, setAuthUser] = useState({})
  let [user_profile, setUserProfile] = useState({})
  let [game, setGame] = useState({})
  let [pass, setPass] = useState([])
  let { game_id } = useParams()
  let [formData, setFormData] = useState({
    user: `http://localhost:8000/users/${user.user_id}`,
    name: '',
    description: '',
    image: '',
  })
  let [passData, setPassData] = useState({
    passes: []
  });

  // const [showDescription, setShowDescription] = useState(true)
  // const [showStore, setShowStore] = useState(false)

  // const handleDescriptionClick = () => {
  //   setShowDescription(true)
  //   setShowStore(false)
  // }
  // const handleStoreClick = () => {
  //   setShowStore(true)
  //   setShowDescription(false)
  // }



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
            setFormData(prevFormData => ({
              ...prevFormData,
              name: gameData.name,
              description: gameData.description,
              image: gameData.image
            }));
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
    addPassObjects()
  }, [])


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
      const filteredPasses = data.filter(pas => pas.game === `http://127.0.0.1:8000/games/${game_id}`);
      setPassData({ passes: filteredPasses });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
    console.log(passData.passes)
  };


  const handlePassChange = (e, index) => {
    const { name, value } = e.target;
    const [field, fieldName, fieldIndex] = name.split('_');
    setPassData((prevPassData) => {
      const passes = [...prevPassData.passes];
      passes[index] = {
        ...passes[index],
        [fieldName]: value,
      };
      return { ...prevPassData, passes };
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(authUser.username, formData)
      const gameResponse = await fetch(`http://localhost:8000/games/${game_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if(gameResponse.statusText === 'Unauthorized'){
        logoutUser()
        return
      }
      const gameData = await gameResponse.json();
      const gameId = gameData.id; // Extract the newly created game's id
      // Update passes with the corresponding game id
      const updatedPasses = passData.passes.map((pass) => ({
        ...pass,
        game: `http://localhost:8000/games/${gameId}`,
      }));


for (let i = 0; i < passData.passes.length; i++) {
    const pass = passData.passes[i];
    const passResponse = await fetch(`http://localhost:8000/pass/${pass.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pass),
    });
  }

} catch (error) {
  console.error(error);
}
};

const addPassObjects = () => {
  setPassData((passData) => {
    const filteredPasses = passData.passes.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`);
    const newPasses = Array.from({ length: 10 }, (_, index) => ({
      name: '',
      description: '',
      image: '',
      price: '',
    }));
    return {
      ...passData,
      passes: [...filteredPasses, ...newPasses],
    };
  });
};
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <p>Game ID: {game_id}</p>
      <p>Game Name: {game.name} <input type="text" name="name" value={formData.name} onChange={handleChange} /></p>
      <p>Created By: {authUser.username}</p>
      <img src={game.image} style={{ maxWidth: '100%', height: 'auto' }} alt={game.name} /> <input type="text" name="image" value={formData.image} onChange={handleChange} />
      <button>PLAY</button>


          <p>Description: {game.description} <input type="text" name="description" value={formData.description} onChange={handleChange} /></p>

        <div>
            {pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).length === 0 ? (
            <p>No passes available.</p>
          ) : (
          pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).map((pas, index) => (
            <div key={pas.id}>
              <div>Pass Name: {pas.name} <input type="text" name={`pass_name_${index}`} value={passData.passes[index].name} onChange={(e) => handlePassChange(e, index)} /></div>
              <div>Pass Description: {pas.description} <input type="text" name={`pass_description_${index}`} value={passData.passes[index].description} onChange={(e) => handlePassChange(e, index)} /></div>
              <img src={pas.image}></img>Pass Image: <input type="text" name={`pass_image_${index}`} value={passData.passes[index].image} onChange={(e) => handlePassChange(e, index)} />
              <div>Pass Price: {pas.price} <input type="text" name={`pass_price_${index}`} value={passData.passes[index].price} onChange={(e) => handlePassChange(e, index)} />
              </div>
            </div>
          ))
        )}
  
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};






