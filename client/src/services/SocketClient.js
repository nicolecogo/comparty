import io from 'socket.io-client';
import ServerClient from './ServerClient';

class SocketClient {
  static partyCode = '123456qwerty';

  //connect to socket
  static socket = io(ServerClient._BASE_URL);
  
  //set up socket listeners
  static socketListeners(partyCode, { updatePlaylist, updatePlayback }) {
    this.socket.on('connect', function() {
      console.log('socket connected');
    });
    this.socket.on('disconnect', function(){
      console.log('socket disconnected')
    });
    //listen for changes on playlist
    this.socket.on(`from:${this.partyCode}:updatePlaylist`, playlist => {
      console.log('msg from server updated playlist', playlist);
      updatePlaylist(playlist);
    });
    //listen for changes on playback
    this.socket.on(`from:${this.partyCode}:updatePlayback`, ({action, timestamp, playback}) => {
      console.log('msg from server updated playback', action, playback);
      updatePlayback(playback, action, timestamp);
    });
  }

  //notify the playlist has changed
  static sendPlaylistChange(updatedPlaylist) {
    this.send(`updatePlaylist`, updatedPlaylist);
  }

  //notify the playback has changed
  static sendPlaybackChange(updatedPlayback, action, timestamp) {
    this.send(`updatePlayback`, {action, timestamp, playback: updatedPlayback});
  }
  
  //generic method for emitting messages
  static send (endpoint, data) {
    if(!this.partyCode) new Error('Party code not available');
    if(!this.socket) new Error('Socket not available');
    this.socket.emit(`from:${this.partyCode}:${endpoint}`, data);
  }

  static disconnect () {
    this.socket.close();
  }
}

export default SocketClient;