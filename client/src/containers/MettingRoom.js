import React from 'react';
import { useUser } from '../context/user';

function MettingRoom () {

  const { authUser } = useUser();
  const displayName = authUser.displayName;

  return (
    <div className="MeetingRoom">
      <div className="meetingroom-main">
        {
          displayName
          ? <h1>Welcome {displayName}!</h1>
          : <h1>Welcome!</h1>
        }
        <h2>Here you can chat with your friends</h2>
        <h2>or start a new video call.</h2>
      </div>
    </div>
  );
}

export default MettingRoom;