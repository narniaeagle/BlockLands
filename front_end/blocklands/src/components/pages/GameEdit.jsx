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
    user: `http://localhost:8000/users/${user.id}`,
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
    passes: [...prevPassData.passes, { name: 'default', description: 'default', image: 'https://tr.rbxcdn.com/a38efe38c0d0b68db8fe45bb84eaba14/420/420/Image/Png', price: '0' }],
  }));
};

const handleRemovePass = (index) => {
  const updatedPasses = [...newPassData.passes];
  updatedPasses.splice(index, 1); 
  setNewPassData({ ...newPassData, passes: updatedPasses }); 
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
      <button className='btn btn-danger mb-5' type="button" onClick={() => deleteGame(game_id)}>DELETE THE GAME</button>
      <div>Game Name: {game.name} <input type="text" name="name" value={formData.name} onChange={handleChange} /></div>
      <div>Created By: {authUser.username}</div>
      <img src={game.image} style={{ maxWidth: '100%', height: 'auto' }} alt={game.name} /> <input type="text" name="image" value={formData.image} onChange={handleChange} />


          <p>Description: {game.description} <input type="text" name="description" value={formData.description} onChange={handleChange} /></p>
          <h2>Passes</h2>
          <div className="row">
  {pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).length === 0 ? (
    <p>No passes available.</p>
  ) : (
    pass.filter((pas) => pas.game === `http://127.0.0.1:8000/games/${game_id}`).map((pas, index) => (
      <div key={'pass'+pas.id} className="col-md-4">
        <div className="pass-item m-4">
          <div>Pass Name: {pas.name} <input type="text" name={`pass_name_${index}`} value={passData.passes[index].name} onChange={(e) => handlePassChange(e, index)} /></div>
          <div><div style={{maxHeight: '3rem', overflowY: 'auto', overflowWrap: 'break-word'}}>Pass Description: {pas.description}</div> <input type="text" rows="4" cols="50"name={`pass_description_${index}`} value={passData.passes[index].description} onChange={(e) => handlePassChange(e, index)} /></div>
          <div><img src={pas.image} className="img-fluid img-thumbnail"></img></div>
          Pass Image: <input type="text" name={`pass_image_${index}`} value={passData.passes[index].image} onChange={(e) => handlePassChange(e, index)} />
          <div>Pass Price: {pas.price} <input type="text" name={`pass_price_${index}`} value={passData.passes[index].price} onChange={(e) => handlePassChange(e, index)} /></div>
          <button className='btn btn-danger' type="button" onClick={() => DeletePass(pas.id)}>Delete</button>
        </div>
      </div>
    ))
  )}
</div>

        <div className="row mb-4">
          {newPassData.passes.map((pas,index)=>(
                <div key={'newpass'+index} className="col-md-4">
                  <div className='pass-item m-4'>
                <div>Pass Name: <input type="text" name={`pass_name_${index}`} value={newPassData.passes[index].name} onChange={(e) => handleNewPassChange(e, index)} /></div>
                <div>Pass Description:  <input type="text" name={`pass_description_${index}`} value={newPassData.passes[index].description} onChange={(e) => handleNewPassChange(e, index)} /></div>
                <img src={pas.image}  className="img-fluid img-thumbnail"></img>Pass Image: <input type="text" name={`pass_image_${index}`} value={newPassData.passes[index].image} onChange={(e) => handleNewPassChange(e, index)} />
                <div>Pass Price:  <input type="text" name={`pass_price_${index}`} value={newPassData.passes[index].price} onChange={(e) => handleNewPassChange(e, index)} /></div>
                <button className='btn btn-warning' type="button" onClick={() => handleRemovePass(index)}>Remove</button>
                </div>
              </div>
          ))}
        </div>
        <input className='btn btn-success' type="submit" value="Submit"/>
      </form>
      <button className='btn btn-secondary' onClick={handleAddPass}>Add Pass</button>
    </div>
  );
};






