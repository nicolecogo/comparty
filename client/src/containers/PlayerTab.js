import React from 'react';
import Player from '../components/Player';
import Playlist from '../components/Playlist';
import { PlayerContext } from '../context/player';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import SpotifyPlayerClient from '../services/SpotifyPlayerClient';

function PlayerTab () {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();

  function play (songs) {
    console.log('Play:', songs[0].name);
    const songsURIs = songs.map(song => song.songURI);
    SpotifyPlayerClient.startPlayback(authToken, authUser.player.deviceId, songsURIs);
    //TODO check if could start playback
    setAuthUser(state => ({ ...state, player: 
      { ...state.player, status: { ...state.player.status, playing: true, currentTrack: songs[0] } }
    }));
    // SpotifyPlayerClient.getPlayback(authToken, authUser.player.deviceId)
    //   .then(playback => {
    //     setAuthUser(state => ({ ...state, player: 
    //       { ...state.player, status: { ...state.player.status, playing: playback.playing, currentTrack: playback.track } }
    //     }));
    //   });
  }
  
  function pause () {
    console.log('Pause:', authUser.player.status.currentTrack.name);
    SpotifyPlayerClient.pausePlayback(authToken, authUser.player.deviceId);
    //TODO check if could pause playback
    setAuthUser(state => ({ ...state, player: 
      { ...state.player, status: { ...state.player.status, playing: false } }
    }));
  }

  function resume () {
    console.log('Resume:', authUser.player.status.currentTrack.name);
    SpotifyPlayerClient.startPlayback(authToken, authUser.player.deviceId);
    //TODO check if could resume playback
    setAuthUser(state => ({ ...state, player: 
      { ...state.player, status: { ...state.player.status, playing: true } }
    }));
  }

  function next () {
    if (authUser.player.status.currentTrack) {
      console.log('Next:', authUser.player.status.currentTrack.name);
      SpotifyPlayerClient.skipPlaybackNext(authToken, authUser.player.deviceId);
      //TODO check if could skip playback
      setAuthUser(state => ({ ...state, player: 
        { ...state.player, status: { ...state.player.status, playing: true } }
      }));
    }
  }

  function previous () {
    if (authUser.player.status.currentTrack) {
      console.log('Previous:', authUser.player.status.currentTrack.name);
      SpotifyPlayerClient.skipPlaybackPrev(authToken, authUser.player.deviceId);
      //TODO check if could skip playback
      setAuthUser(state => ({ ...state, player: 
        { ...state.player, status: { ...state.player.status, playing: true } }
      }));
    }
  }

  return (
    <div className="PlayerTab">
      <PlayerContext.Provider value={ { play, pause, resume, next, previous } }>
        <Player />
        <Playlist />
      </PlayerContext.Provider>
    </div>
  );
}

export default PlayerTab;