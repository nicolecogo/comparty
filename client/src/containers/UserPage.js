import React, { useState } from 'react';
import MettingRoom from './MettingRoom';
import PlayerTab from './PlayerTab';
import UtilitiesTab from './UtilitiesTab';
import { PlaylistContext } from '../context/playlist';

function UserPage () {

  const [ playlistChange, changePlaylist ] = useState({action: '', track: null});

  return (
    <div className="UserPage">
      <MettingRoom />
      <PlaylistContext.Provider value={ {playlistChange, changePlaylist} }>
        <PlayerTab />
        <UtilitiesTab />
      </PlaylistContext.Provider>
    </div>
  );
}

export default UserPage;