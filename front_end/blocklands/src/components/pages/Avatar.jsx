import '../styles/Avatar.css'

import React, { useState, useContext, useEffect } from 'react';
import { HuePicker } from 'react-color'; //CirclePicker looks good
import AuthContext from '../context/AuthContext';

export default function Avatar() {
  let { user, authTokens, logoutUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    user: `http://localhost:8000/users/${user.user_id}`,
    head_color: '',
    torso_color: '',
    right_arm_color: '',
    left_arm_color: '',
    right_leg_color: '',
    left_leg_color: '',
  });

  useEffect(() => {
    const fetchData = async () => {
        try {
            const avatarsUrl = 'http://localhost:8000/avatars';
            const response = await fetch(avatarsUrl);
            const avatars = await response.json();
    
            // Find the avatar to update
            const avatarToUpdate = avatars.find((avatar) => avatar.user === `http://localhost:8000/users/${user.user_id}`);
            const avatarId = avatarToUpdate.id;

          const avatarResponse = await fetch(`http://127.0.0.1:8000/avatars/${avatarId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + String(authTokens.access)
            },
          });
          const data = await avatarResponse.json();
          setFormData(data)

        } catch (error) {
            console.log(error)
        }
      };
    fetchData()
  }, [])



  const handleColorChange = (color, name) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: color.hex,
    }));
    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const avatarsUrl = 'http://localhost:8000/avatars';
        const response = await fetch(avatarsUrl);
        const avatars = await response.json();

        // Find the avatar to update
        const avatarToUpdate = avatars.find((avatar) => avatar.user === `http://localhost:8000/users/${user.user_id}`);

        // Perform update request
        const avatarId = avatarToUpdate.id;
        const avatarUrl = `http://localhost:8000/avatars/${avatarId}`;
        const putResponse = await fetch(avatarUrl, {
          method: 'PUT',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        });
          
        if(putResponse.statusText === 'Unauthorized'){
            logoutUser()
          }
            } catch (error) {
              console.error(error);
            }
          };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        Head:
        <HuePicker
          color={formData.head_color}
          onChangeComplete={(color) => handleColorChange(color, 'head_color')}
        />
        Torso:
        <HuePicker
          color={formData.torso_color}
          onChangeComplete={(color) => handleColorChange(color, 'torso_color')}
        />
        Right Arm:
        <HuePicker
          color={formData.right_arm_color}
          onChangeComplete={(color) => handleColorChange(color, 'right_arm_color')}
        />
        Left Arm:
        <HuePicker
          color={formData.left_arm_color}
          onChangeComplete={(color) => handleColorChange(color, 'left_arm_color')}
        />
        Right Leg:
        <HuePicker
          color={formData.right_leg_color}
          onChangeComplete={(color) => handleColorChange(color, 'right_leg_color')}
        />
        Left Leg:
        <HuePicker
          color={formData.left_leg_color}
          onChangeComplete={(color) => handleColorChange(color, 'left_leg_color')}
        />
        <div className='body-container'>
            <div className="head" style={{'--head-color': formData.head_color}}></div>
            <div className="torso" style={{'--torso-color': formData.torso_color}}></div>
            <div className="right-arm" style={{'--right-arm-color': formData.right_arm_color}}></div>
            <div className="left-arm" style={{'--left-arm-color': formData.left_arm_color}}></div>
            <div className="right-leg" style={{'--right-leg-color': formData.right_leg_color}}></div>
            <div className="left-leg" style={{'--left-leg-color': formData.left_leg_color}}></div>
            </div>
        <input type="submit" />
      </form>
    </div>
  );
}
