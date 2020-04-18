class SpotifyClient {

  static BASE_URL = 'https://api.spotify.com/v1';

  static async getFeaturedPlaylists (token) {
    const method = 'GET';
    const endpoint = '/browse/featured-playlists';
    const body = null;
    return await this.fetchFromSpotify(method, endpoint, token, body);
  }

  static async fetchFromSpotify (method, endpoint, token, body) {
    const url = `${this.BASE_URL}${endpoint}`;
    const options = {
      method: 'GET',
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