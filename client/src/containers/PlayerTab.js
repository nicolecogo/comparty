import React, { useEffect } from 'react';
import Player from '../components/Player';
import Playlist from '../components/Playlist';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { PlayerContext } from '../context/player';
import SpotifyClient from '../services/SpotifyClient';
import SocketClient from '../services/SocketClient';

function PlayerTab () {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  
  useEffect(() => {
    const partyCode = localStorage.getItem('partyCode');
    SocketClient.socketListeners(partyCode, { updatePlaylist, updatePlayback });
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
  async function updatePlayback (playback, action) {
    const songURI = playback.currentTrack.songURI;
    const progress = playback.progress;
    const songsURIs = playback.songsURIs;
    let playing = true;
    console.log('deviceid', authUser.player.deviceId);
    console.log('songsURIs', songsURIs);
    console.log('playback.currentTrack.songURI', playback.currentTrack.songURI);
    console.log('playback.progress', playback.progress);
    try {
      switch (action) {
        case 'play': await SpotifyClient.startPlayback(authToken, authUser.player.deviceId, songsURIs, songURI, progress); break;
        case 'resume': await SpotifyClient.startPlayback(authToken, authUser.player.deviceId, songsURIs, songURI, progress); break;
        case 'pause': await SpotifyClient.pausePlayback(authToken, authUser.player.deviceId); playing = false; break;
        case 'next': await SpotifyClient.skipPlaybackNext(authToken, authUser.player.deviceId); break;
        case 'previous': await SpotifyClient.skipPlaybackPrev(authToken, authUser.player.deviceId); break;
        default: console.log('Not a valid action', action); break;
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
    } catch (error) {
      console.log('It was not possible to play requested songs', error);
    }
  }
  
  async function pause () {
    await authUser.player.player.pause();
    console.log('Paused:', authUser.player.status.currentTrack.name);
    sendPlaybackChange('pause');
  }

  async function resume () {
    await authUser.player.player.resume();
    console.log('Resumed:', authUser.player.status.currentTrack.name);
    sendPlaybackChange('resume');
  }

  async function next () {
    if (authUser.player.status.currentTrack) {
      await authUser.player.player.nextTrack();
      console.log('Playing next');
      sendPlaybackChange('next');
    }
  }

  async function previous () {
    if (authUser.player.status.currentTrack) {
      await authUser.player.player.previousTrack()
      console.log('Playing previous');
      sendPlaybackChange('previous');
    }
  }

  async function sendPlaybackChange (action) {
    console.log('device id', authUser.player.deviceId);
    //player changes status several times before starting the command
    //wait to have updated information
    setTimeout(async () => {
      const playback = await getPlayback(authUser.player.deviceId);
      playback.songsURIs = authUser.playlist.songs.map(song => song.songURI);
      console.log('plaback updated after change', playback);
      SocketClient.sendPlaybackChange(playback, action);
    }, 100);
  }

  async function getPlayback (deviceId) {
    const playback = await SpotifyClient.getPlayback(authToken, deviceId);
    if (!playback) return Promise.reject('User is not playing music through the Web Playback SDK');
    return playback;
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