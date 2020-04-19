
module.exports.authenticate = (req, res) => {
  //TODO redirect directly to client from passport spotify
  res.redirect(`http://localhost:3000/login?token=${req.user.accessToken}&user=${req.user.spotifyId}`);
};