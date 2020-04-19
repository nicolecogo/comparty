import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { Redirect } from 'react-router-dom';

function Login () {
  const { setAuthToken } = useAuth();
  const { setAuthUser } = useUser();
  
  const token = new URLSearchParams(useLocation().search).get("token");
  const userId = new URLSearchParams(useLocation().search).get("user");

  if (!token) return (<Redirect to="/" />);
  if (!userId) return (<Redirect to="/" />);
  
  setAuthToken(token);
  localStorage.setItem('token', token);
  setAuthUser(user => ( { ...user, userId } ));
  localStorage.setItem('user', userId);
  
  return (
    <Redirect to="/user" />
  );
}

export default Login;