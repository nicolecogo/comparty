import React, { useEffect }  from 'react';
import Track from './Track';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { usePlaylist } from '../context/playlist';
import SpotifyClient from '../services/SpotifyClient';
import SocketClient from '../services/SocketClient';

function Playlist ({loading}) {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  const { playlistChange } = usePlaylist();
  const playlist = authUser.playlist.songs;
  
  //upon initialization and on state change get playlist songs from Spotify API
  useEffect(() => {
    loading.setLoadingPlaylist(true);
    getPlaylistFromServer();
    async function getPlaylistFromServer () {
      try {
        const playlistInfo = await SpotifyClient.getPlaylistInfo(authToken, authUser.playlist.playlistId)
        setAuthUser(user => ( { ...user, playlist: playlistInfo } ));
        loading.setLoadingPlaylist(false);
      } catch (error) {
        //TODO check if token expired or playlist deleted
        console.log('Could not retrieve playlist from server', error);
        // setAuthToken();
        // localStorage.removeItem('token');
        // localStorage.removeItem('userId');
        // localStorage.removeItem('playlistId');
        // localStorage.removeItem('partyCode');
      }
    }
  }, [authUser.playlist.playlistId]);

  //listens to playlist changes attempt and executes them
  useEffect(() => {
    if(playlistChange.action === 'add') {
      addToPlaylist(playlistChange.track);
    } else if(playlistChange.action === 'remove') {
      removeFromPlaylist(playlistChange.track);
    }
    SocketClient.sendPlaylistChange(authUser.playlist);
    //add to playlist method made available through playlist state change
    async function addToPlaylist (track) {
      try {
        // if successful at adding song to spotify playlist, update status
        const res = await SpotifyClient.addSongToPlaylist(authToken, authUser.playlist.playlistId, track.songURI);
        setAuthUser(state => 
          ({
            ...state,
            playlist: {
              ...state.playlist,
              snapshotId: res.snapshot_id,
              songs: [
                ...state.playlist.songs,
                track
              ]
            }
          })
        );
      } catch (error) {
        console.log('It was not possible to add song to playlist');
      }
    }
    //remove from playlist method made available through playlist state change
    async function removeFromPlaylist (track) {
      try {
        // if successful at removing song from spotify playlist, update status
        const res = await SpotifyClient.removeSongFromPlaylist(authToken, authUser.playlist.playlistId, track.songURI, authUser.playlist.snapshotId);
        if (res) {
          setAuthUser(state => 
            ({
              ...state,
              playlist: {
                ...state.playlist,
                snapshotId: res.snapshot_id,
                songs: state.playlist.songs.filter(song => song.id !== track.id)
              }
            })
          );
        } else {
          console.log('It was not possible to remove song from playlist');
        }
      } catch (error) {
        console.log('It was not possible to remove song from playlist', error);
      }
    }
  }, [playlistChange]);
  

  return (
    <div className="Playlist">
      {
        !loading.loadingPlaylist && playlist
        ? playlist.map(track => (<Track key={track.id} track={track}/>))
        : <h3>No playlist selected</h3>
      }
    </div>
  );
}

export default Playlist;