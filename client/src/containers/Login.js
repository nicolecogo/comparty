import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { Redirect } from 'react-router-dom';

function Login () {
  const { setAuthToken } = useAuth(); 
  const token = new URLSearchParams(useLocation().search).get("token");
  console.log(token);
  if(token) {
    setAuthToken(token);
    localStorage.setItem('token', token);
  }
  return (
    <Redirect to="/user" />
  );
}

export default Login;