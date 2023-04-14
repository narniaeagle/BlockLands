import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { useParams, useNavigate} from 'react-router-dom'

export default function GameEdit() {
  const navigate = useNavigate()
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
  let [newPassData, setNewPassData] = useState({
    passes:[]
  })


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

  const handleNewPassChange = (e, index) => {
    const { name, value } = e.target;
    const [field, fieldName, fieldIndex] = name.split('_');
    setNewPassData((prevPassData) => {
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

// update the existing passes
for (let i = 0; i < updatedPasses.length; i++) {
    const pass = updatedPasses[i];
    console.log(pass)
    const passResponse = await fetch(`http://localhost:8000/pass/${pass.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pass),
    });
  }


 // add the new passes
  const addedPasses = newPassData.passes.map((pass) => ({
    ...pass,
    game: `http://localhost:8000/games/${gameId}`,
  }));


  for (let i = 0; i < addedPasses.length; i++) {
    const pass = addedPasses[i];
    console.log(pass)
    const passResponse = await fetch(`http://localhost:8000/pass/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pass),
    });
  }
  setNewPassData({ passes: [] })
  getPassDetail()
  
} catch (error) {
  console.error(error);
}
};
const DeletePass = async (id) => {
  try {
   const passResponse = await fetch(`http://localhost:8000/pass/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error)
  }

    getPassDetail()

}


const handleAddPass = async () => {
  setNewPassData((prevPassData) => ({
    ...prevPassData,
    passes: [...prevPassData.passes, { name: 'default', description: 'default', image: 'https://tr.rbxcdn.com/a38efe38c0d0b68db8fe45bb84eaba14/150/150/Image/Png', price: '0' }],
  }));
  console.log(newPassData)
};

const handleRemovePass = (index) => {
  const updatedPasses = [...newPassData.passes]; // create a shallow copy of the passes array
  updatedPasses.splice(index, 1); // remove the pass at the specified index
  setNewPassData({ ...newPassData, passes: updatedPasses }); // update the state with the new passes array
};

const deleteGame = async (game_id) => {
  try {
    const passResponse = await fetch(`http://localhost:8000/games/${game_id}`, {
       method: "DELETE",
       headers: {
         "Content-Type": "application/json",
       },
     });
   } catch (error) {
     console.log(error)
   }
   navigate('/mygames')
 
}

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <p>Game ID: {game_id}</p>
      <p>Game Name: {game.name} <input type="text" name="name" value={formData.name} onChange={handleChange} /></p>
      <p>Created By: {authUser.username}</p>
      <img src={game.image} style={{ maxWidth: '100%', height: 'auto' }} alt={game.name} /> <input type="text" name="image" value={formData.image} onChange={handleChange} />
      <button type="button">PLAY</button>
      <button type="button" onClick={() => deleteGame(game_id)}>DELETE THE GAME</button>


          <p>Description: {game.description} <input type="text" name="description" value={formData.description} onChange={handleChange} /></p>

        <div>
            {pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).length === 0 ? (
            <p>No passes available.</p>
          ) : (
          pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).map((pas, index) => (
            <div key={'pass'+pas.id}>
              <div>Pass Name: {pas.name} <input type="text" name={`pass_name_${index}`} value={passData.passes[index].name} onChange={(e) => handlePassChange(e, index)} /></div>
              <div>Pass Description: {pas.description} <input type="text" name={`pass_description_${index}`} value={passData.passes[index].description} onChange={(e) => handlePassChange(e, index)} /></div>
              <img src={pas.image}></img>Pass Image: <input type="text" name={`pass_image_${index}`} value={passData.passes[index].image} onChange={(e) => handlePassChange(e, index)} />
              <div>Pass Price: {pas.price} <input type="text" name={`pass_price_${index}`} value={passData.passes[index].price} onChange={(e) => handlePassChange(e, index)} /></div>
              <button type="button" onClick={() => DeletePass(pas.id)}>Delete</button>
            </div>
          ))
        )}
  
        </div>
        <div>
          {newPassData.passes.map((pas,index)=>(
                <div key={'newpass'+index}>
                <div>Pass Name: <input type="text" name={`pass_name_${index}`} value={newPassData.passes[index].name} onChange={(e) => handleNewPassChange(e, index)} /></div>
                <div>Pass Description:  <input type="text" name={`pass_description_${index}`} value={newPassData.passes[index].description} onChange={(e) => handleNewPassChange(e, index)} /></div>
                <img src={pas.image}></img>Pass Image: <input type="text" name={`pass_image_${index}`} value={newPassData.passes[index].image} onChange={(e) => handleNewPassChange(e, index)} />
                <div>Pass Price:  <input type="text" name={`pass_price_${index}`} value={newPassData.passes[index].price} onChange={(e) => handleNewPassChange(e, index)} /></div>
                <button  type="button" onClick={() => handleRemovePass(index)}>Remove</button>
              </div>
          ))}
        </div>
        <input type="submit" value="Submit"/>
      </form>
      <button onClick={handleAddPass}>Add Pass</button>
    </div>
  );
};






