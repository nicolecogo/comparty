class SpotifyParser {
  
  static extractSongsFromPlaylist (songlist) {
    return songlist.items.map(( {track} ) =>
      ({
        id: track.id,
        duration: track.duration_ms,
        songURI: track.uri,
        name: track.name,
        artists: track.artists.map(artist => artist.name).join(', ')
      })
    );
  }

  static extractPlaylistInfo (songlist) {
    return {
      playlistId: songlist.id,
      snapshotId: songlist.snapshot_id,
      songs:
        songlist.tracks.items.map(( {track} ) =>
          ({
            id: track.id,
            duration: track.duration_ms,
            songURI: track.uri,
            name: track.name,
            artists: track.artists.map(artist => artist.name).join(', ')
          })
        )
      };
  }
  
  static extractSongsFromSearch (songlist) {
    return songlist.map(( track ) =>
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
      currentTrack: {
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