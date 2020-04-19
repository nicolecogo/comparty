const router = require('express').Router();

const authorization = require('./services/authorization');
const User = require('./controllers/user');
const SpotifyAPI = require('./services/spotifyAPI');

router.get('/login', authorization.authenticate('spotify', {
            scope: ['user-read-email',
            'user-read-private',
            'user-read-playback-state',
            'user-modify-playback-state',
            'user-read-currently-playing',
            'streaming',
            'app-remote-control',
            'playlist-read-collaborative',
            'playlist-read-private',
            'playlist-modify-private']    
          }));
              
router.get('/login/callback', authorization.authenticate('spotify', {
              failureRedirect: '/' }), User.authenticate);

router.get('/browse/discover', ensureAuthenticated, SpotifyAPI.discoverSongs);
router.get('/browse/find', ensureAuthenticated, SpotifyAPI.findSong);
router.get('/me/playlists', ensureAuthenticated, SpotifyAPI.getUserPlaylists);
router.post('/me/playlist/create', ensureAuthenticated, SpotifyAPI.createPlaylist);
router.post('/me/playlist/add', ensureAuthenticated, SpotifyAPI.addSongToPlaylist);
router.delete('/me/playlist/remove', ensureAuthenticated, SpotifyAPI.removeSongFromPlaylist);

//TODO change when client available
router.get('/authenticated', (req, res) => {
  res.send(`<h1>Authenticated ${req.user.displayName}!</h1>`);
});
//TODO change when client available
router.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1> <a href="/login">LOGIN</a>');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401)
}

module.exports = router;