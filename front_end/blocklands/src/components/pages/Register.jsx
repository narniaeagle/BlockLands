import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';

 

import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'


export default function Register () {
  const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
      });

    useEffect(()=> {
        
    }, [])


    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/auth/users/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });
            
            navigate('/login')



        } catch (error) {
            console.error(error);
          }
          
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
             <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3 col-2 mx-auto" controlId="formGroupEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control onChange={handleChange} name="email" value={formData.email} type="email" placeholder="email" />
        </Form.Group>
        <Form.Group className="mb-3 col-2 mx-auto" controlId="formGroupUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control onChange={handleChange} name="username" value={formData.username} type="text" placeholder="username" />
        </Form.Group>
        <Form.Group className="mb-3 col-2 mx-auto" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control onChange={handleChange} name="password" value={formData.password} type="password" placeholder="password" />
        </Form.Group>
        <div className="text-center">
        <Button variant="primary" type="submit" className="mb-2">
        Submit
      </Button>
      </div>
      </Form>
        </div>
    )
}
