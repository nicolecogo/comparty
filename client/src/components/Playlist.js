import React, { useEffect }  from 'react';
import Track from './Track';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { usePlaylist } from '../context/playlist';
import SpotifyClient from '../services/SpotifyClient';
import SocketClient from '../services/SocketClient';

function Playlist () {

  const { authToken, setAuthToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  const { playlistChange } = usePlaylist();
  const playlist = authUser.playlist.songs;
  
  //upon initialization and on state change get playlist songs from Spotify API
  useEffect(() => {
    SpotifyClient.getPlaylistInfo(authToken, authUser.playlist.playlistId)
      .then(res => {
        setAuthUser(user => ( { ...user, playlist: res } ));
      })
      .catch(err => {
        //TODO check if token expired or playlist deleted
        console.log(err);
        setAuthToken();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('playlistId');
        localStorage.removeItem('partyCode');
      });
  }, [authToken, setAuthUser, authUser.playlist.playlistId]);

  //listens to playlist changes attempt and executes them
  useEffect(() => {
    if(playlistChange.action === 'add') {
      addToPlaylist(playlistChange.track);
    } else if(playlistChange.action === 'remove') {
      removeFromPlaylist(playlistChange.track);
    }
    SocketClient.sendPlaylistChange(authUser.playlist);
  }, [playlistChange]);
  
  //add to playlist method made available through playlist state change
  function addToPlaylist (track) {
    // if successful at adding song to spotify playlist, update status
    SpotifyClient.addSongToPlaylist(authToken, authUser.playlist.playlistId, track.songURI)
      .then(res => {
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
      });
  }

  //remove from playlist method made available through playlist state change
  function removeFromPlaylist (track) {
    // if successful at removing song from spotify playlist, update status
    SpotifyClient.removeSongFromPlaylist(authToken, authUser.playlist.playlistId, track.songURI, authUser.playlist.snapshotId)
      .then(res => {
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
      });
  }

  return (
    <div className="Playlist">
      {
        playlist
        ? playlist.map(track => (<Track key={track.id} track={track}/>))
        : <h3>No playlist selected</h3>
      }
    </div>
  );
}

export default Playlist;