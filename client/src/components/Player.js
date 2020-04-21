import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons'
import useScript from '../hooks/useScript'
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { usePlayer } from '../context/player';

function Player () {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  const { play, pause, resume, next, previous, getPlayback } = usePlayer();
  
  // Spotify Web Player (allows playing on the browser)
  useScript('https://sdk.scdn.co/spotify-player.js');
  WebPlayerInit();

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
          ? <h3>{`${authUser.player.status.currentTrack.name} - ${authUser.player.status.currentTrack.artists}`}</h3>
          : null
        }
      </div>
    </div>
  );

  function WebPlayerInit () {
    // called once Spotify Web Player script is loaded
    window.onSpotifyWebPlaybackSDKReady = () => {
      // check if token is available
      if(authToken) {
        const player = new window.Spotify.Player({
          name: 'Comparty',
          getOAuthToken: cb => { cb(authToken); }
        });
        // Error handling
        player.addListener('initialization_error', ({ message }) => {
          //TODO renew token or request login again
          console.log('initialization_error');
          console.error(message);
        });
        player.addListener('authentication_error', ({ message }) => {
          //TODO renew token or request login again
          console.log('authentication_error');
          console.error(message);
        });
        player.addListener('account_error', ({ message }) => {
          //TODO renew token or request login again
          console.log('account_error');
          console.error(message);
        });
        player.addListener('playback_error', ({ message }) => {
          //TODO renew token or request login again
          console.log('playback_error');
          console.error(message);
        });
        // Playback status updates
        player.addListener('player_state_changed', async () => {
          // try {
          //   const playback = await getPlayback(player);
          //   if(playback) {
          //     setAuthUser(state => ({ ...state, player: 
          //       { ...state.player,
          //         status: {
          //           ...state.player.status,
          //           progress: playback.progress,
          //           playing: playback.playing,
          //           currentTrack: playback.currentTrack
          //         }
          //       }
          //     }));
          //   }
          // } catch (error) {
          //   console.log(error);
          // }
        });
        // Ready
        player.addListener('ready', async ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setAuthUser(state => ({ ...state, player: 
            { ...state.player, deviceId: device_id, ready: true }
          }));
        });
        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setAuthUser(state => ({ ...state, player: 
            { ...state.player, ready: false, deviceId: null }
          }));
        });
        setAuthUser(state => ({ ...state, player: { ...state.player, player, ready: false }}));
        // Connect to the player!
        player.connect();
      }
    };
  }

}

export default Player;