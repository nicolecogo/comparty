import React from 'react';
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
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
    localStorage.removeItem('playlistId');
    localStorage.removeItem('partyCode');
    localStorage.removeItem('displayName');
  }

  const partyCode = localStorage.getItem('partyCode');
  const linkIcon = <FontAwesomeIcon icon={faLink} />
  const signoutIcon = <FontAwesomeIcon icon={faSignOutAlt} />

  return (
    <div className="Options">
      <button className="button" data-tip={`Your Party Code is ${partyCode}`}>{linkIcon}</button>
      <button className="button" onClick={handleLogout}>{signoutIcon}</button>
      <ReactTooltip />
    </div>
  );
}

export default Options;