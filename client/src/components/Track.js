import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faTimes } from '@fortawesome/free-solid-svg-icons';
import { usePlayer } from '../context/player';
import { useUser } from '../context/user';
import { usePlaylist } from '../context/playlist';

function Track ({track}) {

  const { play, pause } = usePlayer();
  const { authUser } = useUser();
  const { changePlaylist } = usePlaylist();

  function remove (item) {
    changePlaylist({ action: 'remove', track: item });
  }

  const playIcon = <FontAwesomeIcon icon={faPlay} />
  const pauseIcon = <FontAwesomeIcon icon={faPause} />
  const removeIcon = <FontAwesomeIcon icon={faTimes} />
  const currentClass =  authUser.player.status.playing
    && authUser.player.status.currentTrack.id === track.id ? 'current' : '';
  return (
    <div className={"Track " + currentClass}>
      <h4>{`${track.name} - ${track.artists}`}</h4>
      <div className="button-container">
        {
          authUser.player.status.playing && (authUser.player.status.currentTrack.id === track.id)
          ? <button className="button pause-btn" onClick={() => pause(track)}>{pauseIcon}</button>
          : <button className="button play-btn" onClick={() => play([track])}>{playIcon}</button>
        }
        <button className="button remove-btn" onClick={() => remove(track)}>{removeIcon}</button>
    </div>
    </div>
  );
}

export default Track;