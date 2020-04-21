import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons'
import useScript from '../hooks/useScript'
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { usePlayer } from '../context/player';
import SpotifyWebPlayer from '../services/SpotifyWebPlayer';

function Player () {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  const { play, pause, resume, next, previous } = usePlayer();
  
  // Spotify Web Player (allows playing on the browser)
  useScript('https://sdk.scdn.co/spotify-player.js');
  useEffect(() => {
    SpotifyWebPlayer.WebPlayerInit(authToken, { updatePlayerStatus, updatePlayerInstance });
    return function cleanup() {
      SpotifyWebPlayer.WebPlayerDisconnect();
    }
  }, []);

  function updatePlayerStatus (ready, device_id) {
    console.log('updating player status with devide id', device_id);
    setAuthUser(state => ({ ...state, player: 
      { ...state.player, deviceId: device_id, ready }
    }));
  }

  function updatePlayerInstance (player) {
    console.log('updating player instance', player);
    setAuthUser(state => ({ ...state, player: 
      { ...state.player, player }
    }));
  }

  const playIcon = <FontAwesomeIcon icon={faPlay} />
  const pauseIcon = <FontAwesomeIcon icon={faPause} />
  const prevIcon = <FontAwesomeIcon icon={faBackward} />
  const nextIcon = <FontAwesomeIcon icon={faForward} />
  return (
    <div className="Player">
      <div className="controls">
        <button className="button" onClick={() => { previous() }}>{prevIcon}</button>
        { authUser.player.status.playing
          ? <button className="button" onClick={() => { pause(authUser.player.status.currentTrack) }}>{pauseIcon}</button>
          : ( authUser.player.status.currentTrack
              ? <button className="button" onClick={() => { resume() }}>{playIcon}</button>
              : <button className="button" onClick={() => { play(authUser.playlist.songs) }}>{playIcon}</button>
          )
        }
        <button className="button" onClick={() => { next() }}>{nextIcon}</button>
      </div>
      <div className="info">
        { authUser.player.status.currentTrack
          ? <div>
              <h3>{`${authUser.player.status.currentTrack.name}`}</h3>
              <h4>{`${authUser.player.status.currentTrack.artists}`}</h4>
            </div>
          : null
        }
      </div>
    </div>
  );

}

export default Player;