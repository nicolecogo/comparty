import React, { useEffect, useState } from 'react';
import Player from '../components/Player';
import Playlist from '../components/Playlist';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { PlayerContext } from '../context/player';
import SpotifyClient from '../services/SpotifyClient';
import SocketClient from '../services/SocketClient';
import PlaybackLog from '../components/PlaybackLog';

function PlayerTab () {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  
  const [ loadingPlaylist, setLoadingPlaylist ] = useState(true);

  const [ log, setLog ] = useState('');
  function logPlaybackStatus (log) {
    setLog(log);
  }
  
  useEffect(() => {
    const partyCode = localStorage.getItem('partyCode');
    SocketClient.socketListeners(partyCode, { updatePlaylist, updatePlayback });
    return function cleanup() {
      SocketClient.disconnect();
    }
  }, []);

  //callback function passed to socket listeners to synchronize playlist
  async function updatePlaylist (playlist) {
    try {
      const songs = await SpotifyClient.getPlaylistSongs(authToken, playlist.playlistId);
      setAuthUser(user => ({
        ...user,
        playlist: {
          ...user.playlist,
          songs
        }
      }));
    } catch (error) {
      console.log('Not possible to update playlist', error);
    }
  }

  //callback function passed to socket listeners to synchronize playback
  async function updatePlayback (playback, action, timestamp, author) {
    const songURI = playback.currentTrack.songURI;
    let progress = playback.progress;
    const songsURIs = playback.songsURIs;
    let playing = true;
    console.log('deviceid', authUser.player.deviceId);
    console.log('songsURIs', songsURIs);
    console.log('playback.currentTrack.songURI', playback.currentTrack.songURI);
    console.log('playback.progress', playback.progress);
    console.log('timestamp', timestamp);
    progress += Date.now() - timestamp;
    try {
      switch (action) {
        case 'play':
          await SpotifyClient.startPlayback(authToken, authUser.player.deviceId, songsURIs, songURI, progress);
          logPlaybackStatus(`${author.displayName} started playback`);
          break;
        case 'resume':
          await SpotifyClient.startPlayback(authToken, authUser.player.deviceId, songsURIs, songURI, progress);
          logPlaybackStatus(`${author.displayName} resumed playback`);
          break;
        case 'pause':
          await SpotifyClient.pausePlayback(authToken, authUser.player.deviceId);
          playing = false;
          logPlaybackStatus(`${author.displayName} paused`);
          break;
        case 'next':
          await SpotifyClient.skipPlaybackNext(authToken, authUser.player.deviceId);
          logPlaybackStatus(`${author.displayName} skipped to next song`);
          break;
        case 'previous':
          await SpotifyClient.skipPlaybackPrev(authToken, authUser.player.deviceId);
          logPlaybackStatus(`${author.displayName} skipped to previous song`);
          break;
        default: 
          console.log('Not a valid action', action); 
          break;
      }
      setAuthUser(user => ({
        ...user,
        player: {
          ...user.player,
          status: {
            ...user.player.status,
            progress,
            playing,
            currentTrack: playback.currentTrack
          }
        }
      }));
    } catch (error) {
      console.log('Not possible to update playback');
    }
  }

  async function play (songs) {
    const song = songs[0];
    if(songs.length <= 1) {
      songs = authUser.playlist.songs;
    }
    const songsURIs = songs.map(song => song.songURI);
    try {
      await SpotifyClient.startPlayback(authToken, authUser.player.deviceId, songsURIs, song.songURI);
      sendPlaybackChange('play');
      logPlaybackStatus(`${authUser.displayName} started playback`);
    } catch (error) {
      console.log('It was not possible to play requested songs', error);
    }
  }
  
  async function pause () {
    try {
      await authUser.player.player.pause();
      console.log('Paused:', authUser.player.status.currentTrack.name);
      sendPlaybackChange('pause');
      logPlaybackStatus(`${authUser.displayName} paused`);
    } catch (error) {
      console.log('It was not possible to pause', error);
    }
  }

  async function resume () {
    try {
      await authUser.player.player.resume();
      console.log('Resumed:', authUser.player.status.currentTrack.name);
      sendPlaybackChange('resume');
      logPlaybackStatus(`${authUser.displayName} resumed playback`);
    } catch (error) {
      console.log('It was not possible to resume', error);
    }
  }

  async function next () {
    try {
      if (authUser.player.status.currentTrack) {
        await authUser.player.player.nextTrack();
        console.log('Playing next');
        sendPlaybackChange('next');
        logPlaybackStatus(`${authUser.displayName} skipped to next song`);
      }
    } catch (error) {
      console.log('It was not possible to skip next', error);
    }
  }

  async function previous () {
    try {
      if (authUser.player.status.currentTrack) {
        await authUser.player.player.previousTrack()
        console.log('Playing previous');
        sendPlaybackChange('previous');
        logPlaybackStatus(`${authUser.displayName} skipped to previous song`);
      }
    } catch (error) {
      console.log('It was not possible to pause', error);
    }
  }

  async function sendPlaybackChange (action) {
    console.log('device id', authUser.player.deviceId);
    const timestamp = Date.now();
    //player changes status several times before starting the command
    //wait to have updated information
    setTimeout(async () => {
      try {
        const playback = await getPlayback(authUser.player.deviceId);
        if (playback) {
          playback.songsURIs = authUser.playlist.songs.map(song => song.songURI);
          if (action === 'pause') playback.currentTrack = authUser.player.status.currentTrack;
          console.log('plaback updated after change', playback);
          const { displayName, userId } = authUser;
          SocketClient.sendPlaybackChange(playback, action, timestamp, { displayName, userId });
          setAuthUser(state => ({ ...state, player: 
            { ...state.player,
              status: {
                ...state.player.status,
                progress: playback.progress,
                playing: playback.playing,
                currentTrack: playback.currentTrack
              }
            }
          }));
        }
      } catch (error) {
        console.log('Not possible to update playback', error);
      }
    }, 200);
  }

  async function getPlayback (deviceId) {
    try {
      const playback = await SpotifyClient.getPlayback(authToken, deviceId);
      if (!playback) return Promise.reject('User is not playing music through the Web Playback SDK');
      return playback;
    } catch (error) {
      console.log('Problem retrieving current playback', error);
    }
  }

  return (
    <div className="PlayerTab">
      <PlayerContext.Provider value={ { play, pause, resume, next, previous, getPlayback } }>
        <Player logStatus={logPlaybackStatus}/>
        <Playlist
          loading={ {loadingPlaylist, setLoadingPlaylist} }
          logStatus={logPlaybackStatus}
        />
        <PlaybackLog log={ log }/>
      </PlayerContext.Provider>
    </div>
  );
}

export default PlayerTab;