import React from 'react';
import Player from '../components/Player';
import Playlist from '../components/Playlist';

function PlayerTab () {
  return (
    <div className="PlayerTab">
      <Player />
      <Playlist />
    </div>
  );
}

export default PlayerTab;