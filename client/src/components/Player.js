import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons'
import useScript from '../hooks/useScript'
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import SpotifyClient from '../services/SpotifyClient';

function Player () {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  
  // Spotify Web Player (allows playing on the browser)
  useScript('https://sdk.scdn.co/spotify-player.js');
  WebPlayerInit();

  // Every time token is renovated, renew connection to player
  useEffect(() => {
    if (authToken !== null) {
      setAuthUser(state => ({ ...state, player: {
        ...state.player,
        token: authToken,
        ready: false
      }}));
    }
    connectToPlayer();
  }, [authToken]);

  function handlePlay () {
    // if (!playbackOn) {
      startPlayback();
    // } else {
    //   if (this.state.playbackPaused) {
    //     resumePlayback();
    //   }
    // }
  }

  // function handlePause () {{
  //   if (!this.state.playbackPaused) {
  //     pauseTrack();
  //   }}
  // }

  const playIcon = <FontAwesomeIcon icon={faPlay} />
  const pauseIcon = <FontAwesomeIcon icon={faPause} />
  const prevIcon = <FontAwesomeIcon icon={faBackward} />
  const nextIcon = <FontAwesomeIcon icon={faForward} />
  return (
    <div className="Player">
      <div className="controls">
        <button className="button">{prevIcon}</button>
        <button className="button">{playIcon}</button>
        <button className="button">{nextIcon}</button>
      </div>
      <div className="info">
        <h3>Currently Playing...</h3>
      </div>
      
      <div>
        {
          authUser.player.ready &&
          <div onClick={() => { handlePlay() }}> {playIcon} </div>
        }
        {/* {
          authUser.player.ready && this.state.playbackOn &&
          <div onClick={() => { handlePause() }}> {pauseIcon} </div>
        } */}
      </div>

    </div>
  );

  function WebPlayerInit () {
    // called once Spotify Web Player script is loaded
    window.onSpotifyWebPlaybackSDKReady = () => {
      // check if token is available
      if(authUser.player.token) {
        const player = new window.Spotify.Player({
          name: 'Comparty',
          getOAuthToken: cb => { cb(authUser.player.token); }
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
        player.addListener('player_state_changed', state => {
          //TODO update playlist view
          //TODO trigger socket comunication
          console.log('player_state_changed', state);
        });
        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          setAuthUser(state => ({ ...state, player: 
            { ...player, deviceId: device_id, ready: true }
          }));
        });
        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          setAuthUser(state => ({ ...state, player: 
            { ...player, ready: false }
          }));
        });
        setAuthUser(state => ({ ...state, player: { ...player, player, ready: true }}));
        // Connect to the player!
        player.connect();
      }
    };
  }

  function connectToPlayer () {
    let connectToPlayerTimeout;
    if (authUser.player.status === 'READY') {
      clearTimeout(connectToPlayerTimeout);
      // add event listeners to player getting into "ready" state
      authUser.player.player.addListener('ready', ({device_id}) => {
        setAuthUser(state => ({ ...state, player: 
          { ...state, deviceId: device_id, ready: true }
        }));
      });
      authUser.player.player.connect();
    } else {
      // connectToPlayerTimeout = setTimeout(authUser.player.player.connect.bind(this), 1000);
    }
  }

  function startPlayback() {
    console.log('start playback');
    const firstSong = 'spotify:track:2GplG03rw0CN2EMLzPJZAl';
    console.log(authUser.player.token);
    SpotifyClient.startPlayback(authUser.player.token, authUser.player.deviceId, firstSong);
  }
  function pausePlayback() {
    console.log('pause playback');
  }
  function resumePlayback() {
    console.log('resume playback');
  }

}

export default Player;