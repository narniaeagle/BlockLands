import '../styles/Register.css'

 

import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

export default function Register () {

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
      });
    let {authTokens, logoutUser} = useContext(AuthContext)

    useEffect(()=> {
        
    }, [])


    let handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     const response = await fetch('http://localhost:8000/auth/users/', {
        //       method: 'POST',
        //       headers: {
        //         'Content-Type': 'application/json'
        //       },
        //       body: JSON.stringify(formData)
        //     });
        



        // } catch (error) {
        //     console.error(error);
        //   }
          
    }

    let handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value
        }));
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                Email:<input type="text" name="email" value={formData.email} onChange={handleChange}/>
                Username:<input type="text" name="username" value={formData.username} onChange={handleChange}/>
                Password:<input type="password" name="password" value={formData.password} onChange={handleChange}/>
                <input type="submit"/>
            </form>
        </div>
    )
}

