
module.exports.authenticate = (req, res) => {
  //TODO send the user profile back to client instead of redirecting
  // res.send(req.user.profile);
  res.redirect('/authenticated');
};