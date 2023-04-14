import '../styles/Create.css'
import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'

export default function Create() {
  const navigate = useNavigate()
  let {user, authTokens, logoutUser} = useContext(AuthContext)
  const [formData, setFormData] = useState({
    user: `http://localhost:8000/users/${user.user_id}`,
    name: '',
    description: '',
    image: '',
  });
  const [passData, setPassData] = useState({
    passes: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(user.username)
      const gameResponse = await fetch('http://localhost:8000/games/', {
        method: 'POST',
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

for (let i = 0; i < updatedPasses.length; i++) {
    const pass = updatedPasses[i];
    const passResponse = await fetch("http://localhost:8000/pass/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pass),
    });
  }

  navigate('/mygames')

} catch (error) {
  console.error(error);
}
};

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
  
  const handleRemovePass = (index) => {
    const updatedPasses = [...passData.passes]; 
    updatedPasses.splice(index, 1);
    setPassData({ ...passData, passes: updatedPasses }); 
  };

  const handleAddPass = () => {
    setPassData((prevPassData) => ({
      ...prevPassData,
      passes: [...prevPassData.passes, { name: '', description: '', image: '', price: '' }],
    }));
  };
  return (
    <div>
      <h2>CREATE</h2>
      <form onSubmit={handleSubmit}>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
        Description:
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        Image:
        <input type="text" name="image" value={formData.image} onChange={handleChange} />
        <button type="button" onClick={handleAddPass}>
          Add Pass
        </button>
        {passData.passes.map((pass, index) => (
          <div key={index}>
            Name:
            <input
              type="text"
              name={`pass_name_${index}`}
              value={pass.name}
              onChange={(e) => handlePassChange(e, index)}
            />
            Description:
            <input
              type="text"
              name={`pass_description_${index}`}
              value={pass.description}
              onChange={(e) => handlePassChange(e, index)}
            />
            Image:
            <input
              type="text"
              name={`pass_image_${index}`}
              value={pass.image}
              onChange={(e) => handlePassChange(e, index)}
            />
            Price:
            <input
              type="text"
              name={`pass_price_${index}`}
              value={pass.price}
              onChange={(e) => handlePassChange(e, index)}
            />
             <button type="button" onClick={() => handleRemovePass(index)}>Remove</button>
          </div>
        ))}
        <input type="submit" />
      </form>
    </div>
  );
        }
