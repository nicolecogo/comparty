import React from 'react';
import Player from '../components/Player';
import Playlist from '../components/Playlist';
import { PlayerContext } from '../context/player';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import SpotifyClient from '../services/SpotifyClient';

function PlayerTab () {

  const { authToken } = useAuth();
  const { authUser } = useUser();

  function play (songs) {
    const song = songs[0];
    if(songs.length <= 1) {
      songs = authUser.playlist.songs;
    }
    const songsURIs = songs.map(song => song.songURI);
    console.log('Play:', song.name);
    SpotifyClient.startPlayback(authToken, authUser.player.deviceId, songsURIs, song.songURI);
  }
  
  function pause () {
    authUser.player.player.pause()
    .then(() => {
        console.log('Paused:', authUser.player.status.currentTrack.name);
      });
  }

  function resume () {
    authUser.player.player.resume()
    .then(() => {
        console.log('Resumed:', authUser.player.status.currentTrack.name);
      });
  }

  function next () {
    if (authUser.player.status.currentTrack) {
      authUser.player.player.nextTrack()
      .then(() => {
          console.log('Playing next');
        });
    }
  }

  function previous () {
    if (authUser.player.status.currentTrack) {
      authUser.player.player.previousTrack()
      .then(() => {
          console.log('Playing previous');
        });
    }
  }

  async function getPlayback (player) {
    return await player.getCurrentState().then(state => {
      if (!state) return Promise.reject('User is not playing music through the Web Playback SDK');
      const parsedState = {
        progress: state.position,
        playing: !state.paused,
        currentTrack: {
          id: state.track_window.current_track.id,
          songURI: state.track_window.current_track.uri,
          name: state.track_window.current_track.name,
          artists: state.track_window.current_track.artists.map(artist => artist.name).join(', '),
        }
      };
      return parsedState;
    });
  }

  return (
    <div className="PlayerTab">
      <PlayerContext.Provider value={ { play, pause, resume, next, previous, getPlayback } }>
        <Player />
        <Playlist />
      </PlayerContext.Provider>
    </div>
  );
}

export default PlayerTab;