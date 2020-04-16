const fetch = require('node-fetch');

const BASE_URL = 'https://api.spotify.com/v1';


module.exports.discoverSongs = (req, res) => {
  spotifyAPIrequest(req, res, 'GET', '/browse/featured-playlists', null);
};

module.exports.findSong = (req, res) => {
  if(!req.body.searchWords) {
    res.status(400);
    res.send('Missing property searchWords at body.');
  }
  const body = {
    q: encodeURI(req.body.searchWords),
    type: 'album,artist,track',
    market: 'from_token'
  };
  spotifyAPIrequest(req, res, 'GET', '/search', body);
};

module.exports.getUserPlaylists = (req, res) => {
  spotifyAPIrequest(req, res, 'GET', '/me/playlists', null);
};

module.exports.createPlaylist = (req, res) => {
  const body = {
    name: 'Comparty::playlist',
    public: false,
    collaborative: false,
    description: 'Listen together with your friends with Comparty (automatically created by Comparty)'
  };
  spotifyAPIrequest(req, res, 'POST', `/users/${req.user.spotifyId}/playlists`, body);
};

module.exports.addSongToPlaylist = (req, res) => {
  if(!req.body.playlistId) {
    res.status(409);
    res.send('No default playlist has been created yet.');
  }
  if(!req.body.uri) {
    res.status(400);
    res.send('Missing property uri at body.');
  }
  const body = {
    uris: ['spotify:track:' + req.body.uri]
  };
  spotifyAPIrequest(req, res, 'POST', `/playlists/${req.user.playlistId}/tracks`, body);
};

module.exports.removeSongFromPlaylist = (req, res) => {
  if(!req.body.playlistId) {
    res.status(409);
    res.send('No default playlist has been created yet.');
  }
  if(!req.body.uri || !req.body.position || !req.body.snapshotId) {
    res.status(400);
    res.send('Missing property uri, position and/or snapshotId at body.');
  }
  const body = {
    tracks: [{
      uri: 'spotify:track:' + req.body.uri,
      positions: [req.body.position]
    }],
    snapshot_id: req.body.snapshotId
  };
  spotifyAPIrequest(req, res, 'POST', `/playlists/${req.user.playlistId}/tracks`, body);
}

function spotifyAPIrequest (req, res, method, endpoint, body) {
  var options = {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + req.user.accessToken,
      'Content-Type': 'application/json'
    }
  };
  const url = BASE_URL + endpoint;
  fetch(url, options)
    .then(response => response.json())
    .then(json => {
      console.log(json);
      res.send(json);
    })
    .catch(err => {
      console.log(`Error requesting from SpotifyAPI: ${options.method} ${BASE_URL + endpoint}`, err);
      res.status(500);
      res.send(err);
    });
}