const router = require('express').Router();

const authorization = require('./services/authorization');
const User = require('./controllers/user');

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

//TODO endpoints to implement

//Party.find searchs for an existing party with a given id
//return boolean
// router.get('/party/:id', Party.find);

//Party.create checks if there are any parties associated with user
//    if not, create one and a new spotify playlist
//return partyId and spotify playlistId associated with party
// router.get('/party/create', Party.create);

// router.get('/party/join', Party.join);

module.exports = router;