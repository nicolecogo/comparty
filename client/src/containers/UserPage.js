import React from 'react';
import MettingRoom from './MettingRoom';
import PlayerTab from './PlayerTab';
import UtilitiesTab from './UtilitiesTab';

function UserPage () {
  
  return (
    <div className="UserPage">
      <MettingRoom />
      <PlayerTab />
      <UtilitiesTab />
    </div>
  );
}

export default UserPage;