class SpotifyParser {
  
  static extractSongs (playlist) {
    return playlist.items.map(( {track} ) =>
      ({
        id: track.id,
        songURI: track.uri,
        name: track.name,
        artists: track.artists.map(artist => artist.name).join(', ')
      })
    );
  }

}

export default SpotifyParser;