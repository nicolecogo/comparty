const router = require('express').Router();

const authorization = require('./services/authorization');
const User = require('./controllers/user');
const SpotifyAPI = require('./services/spotifyAPI');

router.get('/login', authorization.authenticate('spotify'));
router.get('/login/callback', authorization.authenticate('spotify', { failureRedirect: '/' }), User.authenticate);

router.get('/me/playlists', ensureAuthenticated, SpotifyAPI.getUserPlaylists);

//TODO change when client available
router.get('/authenticated', (req, res) => {
  res.send(`<h1>Authenticated ${req.user.profile.displayName}!</h1>`);
});
//TODO change when client available
router.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1> <a href="/login">LOGIN</a>');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;