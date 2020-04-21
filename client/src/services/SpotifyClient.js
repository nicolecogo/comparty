import SpotifyParser from './SpotifyParser';
import axios from 'axios';

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
    const method = 'PUT';
    let endpoint = `/me/player/play`;
    if(deviceId) endpoint = endpoint.concat(`?device_id=${deviceId}`);
    let body = {};
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
    const method = 'PUT';
    let endpoint = `/me/player/pause`;
    if(deviceId) endpoint = endpoint.concat(`?device_id=${deviceId}`);
    let body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }
  
  static async skipPlaybackNext (token, deviceId) {
    const method = 'POST';
    let endpoint = `/me/player/next`;
    if(deviceId) endpoint = endpoint.concat(`?device_id=${deviceId}`);
    let body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }
  
  static async skipPlaybackPrev (token, deviceId) {
    const method = 'POST';
    let endpoint = `/me/player/previous`;
    if(deviceId) endpoint = endpoint.concat(`?device_id=${deviceId}`);
    let body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async fetchFromSpotify (method, endpoint, token, body) {
    const url = `${this.BASE_URL}${endpoint}`;
    const options = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    if(body) options.data = JSON.stringify(body);

    return axios(options)
      .then(response => {
        if(response.error && response.error.message) {
          Promise.reject('Error retrieving from Spotify API', response.error.message);
        }
        else return response;
      })
      .then(response => response.data)
      .catch(err => {
        Promise.reject('Error retrieving from Spotify API', err);
      });
  }
}

export default SpotifyClient;