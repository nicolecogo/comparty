import React from 'react';
import ReactTooltip from "react-tooltip";
import { useUser } from '../context/user';

function MettingRoom () {

  const { authUser } = useUser();
  const displayName = authUser.displayName;
  const partyCode = localStorage.getItem('partyCode');

  return (
    <div className="MeetingRoom">
      <div className="logo">
        <h1>Comparty</h1>
      </div>
      <div className="meetingroom-main">
        {
          displayName
          ? <h1>Welcome {displayName}!</h1>
          : <h1>Welcome!</h1>
        }
        <h2>Your party code is {partyCode}</h2>
        <h2>Share it with your friends</h2>
        <h2>to start listening together.</h2>
        <ReactTooltip />
      </div>
    </div>
  );
}

export default MettingRoom;