import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { Redirect } from 'react-router-dom';


//first entry point after authenticating from server
//retrieves all info passed through http parameters
function Login () {
  const { setAuthToken } = useAuth();
  const { setAuthUser } = useUser();
  
  const token = new URLSearchParams(useLocation().search).get('token');
  const userId = new URLSearchParams(useLocation().search).get('user');
  const partyCode = localStorage.getItem('partyCode');
  // let playlistId;
  //TODO if there is no party code, create a new party if user doesn't have any
  // if(!partyCode) {playlistId, partyCode} = ServerClient.createOrRetrieveParty(userId);
  //TODO if there is a party code, subscribe user to it
  // else playlistId = ServerClient.subscribeToParty(userId, partyCode);
  const playlistId = '0ZG19BTfYVGL05tYaH1CfM';
  
  if (!token) return (<Redirect to="/" />);
  if (!userId) return (<Redirect to="/" />);
  if (!playlistId) return (<Redirect to="/" />);
  
  //update authentication and user contexts
  setAuthToken(token);
  setAuthUser(user => ( { ...user, userId, playlist: { ...user.playlist, playlistId } } ));
  
  //save session at local storage
  localStorage.setItem('token', token);
  localStorage.setItem('user', userId);
  localStorage.setItem('playlistId', playlistId);
  localStorage.setItem('partyCode', partyCode);
  
  return (
    <Redirect to="/user" />
  );
}

export default Login;