import React from 'react';
import MettingRoom from './MettingRoom';
import PlayerTab from './PlayerTab';
import { useAuth   } from '../context/auth';

function UserPage () {

  const { setAuthToken } = useAuth();

  function handleLogout () {
    setAuthToken();
    localStorage.removeItem('token');
  }
  
  return (
    <div className="UserPage">
      <MettingRoom />
      <PlayerTab />
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
}

export default UserPage;