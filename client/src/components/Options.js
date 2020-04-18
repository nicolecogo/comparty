import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/auth';

function Options () {

  const { setAuthToken } = useAuth();

  function handleLogout () {
    setAuthToken();
    localStorage.removeItem('token');
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