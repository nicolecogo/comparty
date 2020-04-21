class SpotifyWebPlayer {

  static player;
  
  static WebPlayerInit (authToken, { updatePlayerStatus, updatePlayerInstance }) {
    // called once Spotify Web Player script is loaded
    window.onSpotifyWebPlaybackSDKReady = () => {
      // check if token is available
      if(authToken) {
        this.player = new window.Spotify.Player({
          name: 'Comparty',
          getOAuthToken: cb => { cb(authToken); }
        });
        // Error handling
        this.player.addListener('initialization_error', ({ message }) => {
          //TODO renew token or request login again
          console.log('initialization_error');
          console.error(message);
        });
        this.player.addListener('authentication_error', ({ message }) => {
          //TODO renew token or request login again
          console.log('authentication_error');
          console.error(message);
        });
        this.player.addListener('account_error', ({ message }) => {
          //TODO renew token or request login again
          console.log('account_error');
          console.error(message);
        });
        this.player.addListener('playback_error', ({ message }) => {
          //TODO renew token or request login again
          console.log('playback_error');
          console.error(message);
        });
        // Playback status updates
        this.player.addListener('player_state_changed', async () => {
        });
        // Ready
        this.player.addListener('ready', async ({ device_id }) => {
          console.log('Ready with Device ID', device_id);
          updatePlayerStatus(true, device_id);
        });
        // Not Ready
        this.player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id);
          updatePlayerStatus(false, device_id);
        });
        updatePlayerInstance(this.player);
        this.player.connect();;
      }
    };
  }

  static WebPlayerDisconnect () {
    if (this.player) this.player.disconnect();
  }

}

export default SpotifyWebPlayer;