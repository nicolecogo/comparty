import React, { useEffect }  from 'react';
import Track from './Track';
import SpotifyClient from '../services/SpotifyClient';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';
import { usePlaylist } from '../context/playlist';

function Playlist () {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  const { playlistChange } = usePlaylist();
  const playlist = authUser.playlist.songs;
  
  useEffect(() => {
    //TODO retrieve playlists to choose from or save unique app playlist
    const playlistId = '7ygPUp7e6fSmOTkcuooQQv';
    SpotifyClient.getPlaylistInfo(authToken, playlistId)
      .then(res => {
        setAuthUser(user => ( { ...user, playlist: res } ));
      })
      .catch(err => {
        //TODO check if token expired or playlist deleted
        console.log(err);
      });
  }, [authToken, setAuthUser]);

  useEffect(() => {
    if(playlistChange.action === 'add') {
      addToPlaylist(playlistChange.track);
    } else if(playlistChange.action === 'remove') {
      removeFromPlaylist(playlistChange.track);
    }
  }, [playlistChange]);
  
  function addToPlaylist (track) {
    // try to add song to spotify playlist
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

  function removeFromPlaylist (track) {
    // try to add song to spotify playlist
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