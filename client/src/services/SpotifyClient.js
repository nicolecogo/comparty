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
    // const params = '?fields=track&market=from_token';
    const body = null;
    const playlist =  await this.fetchFromSpotify(method, endpoint, token, body);
    return SpotifyParser.extractSongs(playlist);
  }

  static async findSong (token, searchWords) {
    if(!searchWords) return Promise.reject('No search words provided');
    const method = 'GET';
    const endpoint = '/search';
    const body = {
      q: encodeURI(searchWords),
      type: 'album,artist,track',
      market: 'from_token'
    };
    return await this.fetchFromSpotify(method, endpoint, token, body);
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
      uris: ['spotify:track:' + songURI]
    };
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async removeSongFromPlaylist (token, playlistId, songURI, songPosition, snapshotId) {
    if(!playlistId) return Promise.reject('No playlist id provided');
    if(!songURI) return Promise.reject('No song URI provided');
    if(!songPosition) return Promise.reject('No song position provided');
    if(!snapshotId) return Promise.reject('No snapshot id provided');
    const method = 'DELETE';
    const endpoint = `/playlists/${playlistId}/tracks`;
    const body = {
      tracks: [{
        uri: 'spotify:track:' + songURI,
        positions: [songPosition]
      }],
      snapshot_id: snapshotId
    };
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