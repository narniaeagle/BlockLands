import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';


import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div>
      <Form onSubmit={loginUser}>
        <Form.Group className="mb-3 col-2 mx-auto" controlId="formGroupUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control name="username" type="text" placeholder="username" />
        </Form.Group>
        <Form.Group className="mb-3 col-2 mx-auto" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control name="password" type="password" placeholder="password" />
        </Form.Group>
        <div className="text-center">
        <Button variant="primary" type="submit" className="mb-2">
        Submit
      </Button>
      </div>
      </Form>
    </div>
  );
};

export default Login;

// <form onSubmit={loginUser}>
// <input type="text" name="username" placeholder="Enter Username" />
// <input type="password" name="password" placeholder="Enter Password" />
// <input type="submit"/>
// </form>
