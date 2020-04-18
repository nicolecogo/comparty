import React from 'react';
import SpotifyClient from '../services/SpotifyClient.js';

function PlayerTab () {

  function handleClick () {
    const token = localStorage.getItem('token');
    console.log(token);
    SpotifyClient.getFeaturedPlaylists(token)
      .then(res => console.log(res));
  }

  return (
    <div className="PlayerTab">
      Player tab
      <button onClick={() => handleClick()}>getPlaylist</button>
    </div>
  );
}

export default PlayerTab;