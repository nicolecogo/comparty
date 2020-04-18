const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const router = require('./router');

const SERVER_URL = process.env.SERVER_BASE_URL || 'http://localhost';
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
  //TODO change to secure http connection
  //cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server listening at ${SERVER_URL}:${PORT}`);
});