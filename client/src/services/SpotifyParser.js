class SpotifyParser {
  
  static extractSongs (playlist) {
    return playlist.items.map(( {track} ) =>
      ({
        id: track.id,
        duration: track.duration_ms,
        songURI: track.uri,
        name: track.name,
        artists: track.artists.map(artist => artist.name).join(', ')
      })
    );
  }

  static extractPlayback (playback) {
    return {
      progress: playback.progress_ms,
      playing: playback.is_playing,
      track: {
        id: playback.item.id,
        duration: playback.item.duration_ms,
        songURI: playback.item.uri,
        name: playback.item.name,
        artists: playback.item.artists.map(artist => artist.name).join(', ')
      }
    };
  }

}

export default SpotifyParser;