
module.exports.authenticate = (req, res) => {
  res.redirect('http://localhost:3000/login'
              +`?token=${req.user.accessToken}`
              +`&user=${req.user.spotifyId}`
              +`&displayName=${req.user.displayName}`
  );
};