const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const url = require('url');

const User = require('../models/user');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SERVER_URL = `${process.env.SERVER_BASE_URL}:${process.env.PORT}`;
const CALLBACK_URL = url.resolve(SERVER_URL, '/login/callback');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

const spotifyConfiguration = new SpotifyStrategy(
  {
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL
  },
  async function(accessToken, refreshToken, expires_in, profile, done) {
    if(!profile) done(new Error('Empty profile'), profile);
    const user = new User(profile, accessToken, refreshToken, expires_in);
    done(null, user);
  }
);

passport.use(spotifyConfiguration);

module.exports = passport;