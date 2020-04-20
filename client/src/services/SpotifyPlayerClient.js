import SpotifyParser from './SpotifyParser';

class SpotifyPlayerClient {

  static BASE_URL = 'https://api.spotify.com/v1';

  static async getPlayback (token, deviceId) {
    if(!deviceId) return Promise.reject('No device id provided');
    const method = 'GET';
    const endpoint = `/me/player`;
    let body = null;
    const playback = await this.fetchFromSpotify(method, endpoint, token, body);
    if(!playback) return null;
    return SpotifyParser.extractPlayback(playback);
  }

  static async startPlayback (token, deviceId, spotifyURIs) {
    if(!deviceId) return Promise.reject('No device id provided');
    const method = 'PUT';
    const endpoint = `/me/player/play?device_id=${deviceId}`;
    let body = null;
    if(spotifyURIs && spotifyURIs[0]) {
      body = {
        uris: spotifyURIs
      };
    }
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
      .then(response => {
        if (response.ok) return response.json();
        else {
          console.log('Error retrieving from Spotify API');
          return null;
        }
      })
      .then(response => {
        if(response.error && response.error.message) {
          Promise.reject(response.error.message);
          return null;
        }
        //TODO fetch current status of player
        else return response;
      })
      .catch(err => {
        console.log('Error retrieving from Spotify API', err);
        return null;
      });
  }
}

export default SpotifyPlayerClient;