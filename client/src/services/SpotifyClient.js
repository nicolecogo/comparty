import SpotifyParser from './SpotifyParser';

class SpotifyClient {

  static BASE_URL = 'https://api.spotify.com/v1';

  static async getFeaturedPlaylists (token) {
    const method = 'GET';
    const endpoint = '/browse/featured-playlists';
    const body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async getUserPlaylists (token) {
    const method = 'GET';
    const endpoint = '/me/playlists';
    const body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async getPlaylistSongs (token, playlistId) {
    if(!playlistId) return Promise.reject('No playlist id provided');
    const method = 'GET';
    const endpoint = `/playlists/${playlistId}/tracks`;
    const body = null;
    const playlist =  await this.fetchFromSpotify(method, endpoint, token, body);
    if(!playlist) return null;
    return SpotifyParser.extractSongsFromPlaylist(playlist);
  }
  
  static async getPlaylistInfo (token, playlistId) {
    if(!playlistId) return Promise.reject('No playlist id provided');
    const method = 'GET';
    const endpoint = `/playlists/${playlistId}`;
    const body = null;
    const playlist =  await this.fetchFromSpotify(method, endpoint, token, body);
    if(!playlist) return null;
    return SpotifyParser.extractPlaylistInfo(playlist);
  }

  static async findSong (token, searchWords) {
    if(!searchWords) return Promise.reject('No search words provided');
    const method = 'GET';
    const endpoint = '/search';
    const params = `?q=${encodeURI(searchWords)}&type=track&market=from_token`;
    const body = null;
    const search = await this.fetchFromSpotify(method, endpoint + params, token, body);
    if(!search) return null;
    return SpotifyParser.extractSongsFromSearch(search.tracks.items);
  }

  static async createDefaultPlaylist (token, userId) {
    if(!userId) return Promise.reject('No user id provided');
    this.createPlaylist(token, userId, 'Comparty::playlist');
  }

  static async createPlaylist (token, userId, name) {
    if(!userId) return Promise.reject('No user id provided');
    if(!name) return Promise.reject('No name provided');
    const method = 'GET';
    const endpoint = `/users/${userId}/playlists`;
    const body = {
      name,
      public: false,
      collaborative: false,
      description: 'Listen together with your friends with Comparty (automatically created by Comparty)'
    };
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async addSongToPlaylist (token, playlistId, songURI) {
    if(!playlistId) return Promise.reject('No playlist id provided');
    if(!songURI) return Promise.reject('No song URI provided');
    const method = 'POST';
    const endpoint = `/playlists/${playlistId}/tracks`;
    const body = {
      uris: [songURI]
    };
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async removeSongFromPlaylist (token, playlistId, songURI, snapshotId) {
    if(!playlistId) return Promise.reject('No playlist id provided');
    if(!songURI) return Promise.reject('No song URI provided');
    if(!snapshotId) return Promise.reject('No snapshot id provided');
    const method = 'DELETE';
    const endpoint = `/playlists/${playlistId}/tracks`;
    const body = {
      tracks: [{
        uri: songURI
      }],
      snapshot_id: snapshotId
    };
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async getPlayback (token, deviceId) {
    if(!deviceId) return Promise.reject('No device id provided');
    const method = 'GET';
    const endpoint = `/me/player`;
    let body = null;
    const playback = await this.fetchFromSpotify(method, endpoint, token, body);
    if(!playback) return null;
    return SpotifyParser.extractPlayback(playback);
  }

  static async startPlayback (token, deviceId, songsURIs, songURI, position) {
    if(!deviceId) return Promise.reject('No device id provided');
    const method = 'PUT';
    const endpoint = `/me/player/play?device_id=${deviceId}`;
    let body = null;
    if(!songURI) songURI = songsURIs[0];
    if(songsURIs && songsURIs[0]) {
      body = {
        uris: songsURIs,
        offset: {uri: songURI}
      };
    }
    if(position) body.position_ms = position;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }
  
  static async pausePlayback (token, deviceId) {
    if(!deviceId) return Promise.reject('No device id provided');
    const method = 'PUT';
    const endpoint = `/me/player/pause`;
    let body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }
  
  static async skipPlaybackNext (token, deviceId) {
    if(!deviceId) return Promise.reject('No device id provided');
    const method = 'POST';
    const endpoint = `/me/player/next`;
    let body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }
  
  static async skipPlaybackPrev (token, deviceId) {
    if(!deviceId) return Promise.reject('No device id provided');
    const method = 'POST';
    const endpoint = `/me/player/previous`;
    let body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async fetchFromSpotify (method, endpoint, token, body) {
    const url = `${this.BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    if(body) options.body = JSON.stringify(body);
    return await fetch(url, options)
      .then(response => response.json())
      .then(response => {
        if(response.error && response.error.message) {
          console.log('Error retrieving from Spotify API', response.error.message);
          return null;
        }
        else return response;
      })
      .catch(err => {
        console.log('Error retrieving from Spotify API', err);
        return null;
      });
  }
}

export default SpotifyClient;