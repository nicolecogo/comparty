const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const app = express();

const router = require('./router');

const SERVER_URL = process.env.SERVER_BASE_URL || 'http://localhost';
const CLIENT_URL = process.env.CLIENT_BASE_URL || 'http://localhost';
const PORT = process.env.PORT || 3001;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

const corsOptions = {
  origin: `${CLIENT_URL}:${CLIENT_PORT}`,
  optionsSuccessStatus: 200,
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  //TODO change to secure http connection
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

const server = app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening at ${SERVER_URL}:${PORT}`);
});

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  socket.broadcast.emit('hello', 'holaa');
  console.log('user connected');
  //TODO get code from session
  const partyCode = '123456qwerty';
  //listen for changes on playlist
  socket.on(`from:${partyCode}:updatePlaylist`, (updatedPlaylist) => {
    console.log('updated playlist', updatedPlaylist);
    socket.broadcast.emit(`from:${partyCode}:updatePlaylist`, updatedPlaylist);
  });
  //listen for changes on playback
  socket.on(`from:${partyCode}:updatePlayback`, (updatedPlayback) => {
    console.log('updated playback', updatedPlayback);
    socket.broadcast.emit(`from:${partyCode}:updatePlayback`, updatedPlayback);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});