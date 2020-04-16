class User {

  constructor(profile, accessToken, refreshToken, expires_in) {
    this.spotifyId = profile.id;
    this.displayName = profile.displayName;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expirationDate = Date.now() + (parseInt(expires_in) * 1000);
  }
  
}

module.exports = User;
