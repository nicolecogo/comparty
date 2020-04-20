import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../context/player';
import { useUser } from '../context/user';

function Track ({track}) {

  const { play, pause } = usePlayer();
  const { authUser } = useUser();

  const playIcon = <FontAwesomeIcon icon={faPlay} />
  const pauseIcon = <FontAwesomeIcon icon={faPause} />
  return (
    <div className="Track">
      <h4>{`${track.name} - ${track.artists}`}</h4>
      {
        authUser.player.status.playing && (authUser.player.status.currentTrack.id === track.id)
        ? <button className="button" onClick={() => pause(track)}>{pauseIcon}</button>
        : <button className="button" onClick={() => play([track])}>{playIcon}</button>
      }
    </div>
  );
}

export default Track;