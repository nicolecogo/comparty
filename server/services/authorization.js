const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const url = require('url');

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
  function(accessToken, refreshToken, expires_in, profile, done) {
    //TODO change to retrieve/add to DB
    done(null, { accessToken, refreshToken, expires_in, profile });
  }
);

passport.use(spotifyConfiguration);

module.exports = passport;