import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';

function Options () {

  const { setAuthToken } = useAuth();
  const { setAuthUser } = useUser();

  function handleLogout () {
    setAuthToken();
    localStorage.removeItem('token');
    setAuthUser();
    localStorage.removeItem('user');
  }

  const settingsIcon = <FontAwesomeIcon icon={faCog} />
  const signoutIcon = <FontAwesomeIcon icon={faSignOutAlt} />

  return (
    <div className="Options">
      <button className="button">{settingsIcon}</button>
      <button className="button" onClick={handleLogout}>{signoutIcon}</button>
    </div>
  );
}

export default Options;