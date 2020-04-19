import React, { useEffect }  from 'react';
import Track from './Track';
import SpotifyClient from '../services/SpotifyClient';
import { useAuth } from '../context/auth';
import { useUser } from '../context/user';

function Playlist () {

  const { authToken } = useAuth();
  const { authUser, setAuthUser } = useUser();
  const playlist = authUser.playlist.songs;
  
  useEffect(() => {
    //TODO retrieve playlists to choose from or save unique app playlist
    const playlistId = '2OfUhsiHw4zEWrweZqHpkW';
    SpotifyClient.getPlaylistSongs(authToken, playlistId)
      .then(res => {
        console.log(res);
        setAuthUser(user => ( { ...user, playlist: {playlistId, songs: res} } ));
      })
      .catch(err => {
        //TODO check if token expired or playlist deleted
        console.log(err);
      });
  }, []);

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