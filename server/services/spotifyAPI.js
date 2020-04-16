const request = require('request');

const BASE_URL = 'https://api.spotify.com/v1';

module.exports.getUserPlaylists = async (req, res) => {
  var options = {
    url: BASE_URL + '/me/playlists',
    headers: { 'Authorization': 'Bearer ' + req.user.accessToken },
    json: true
  };
  request.get(options, function(error, response, body) {
    if(error) {
      console.log(error);
      res.send(error);
    } else {
      res.send(body);
    }
  });
};