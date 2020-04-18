import React from 'react';
import Track from './Track';
// import SpotifyClient from '../services/SpotifyClient';

function Playlist () {

  // function showPlaylist () {
  //   const token = localStorage.getItem('token');
  //   console.log(token);
  //   return SpotifyClient.getFeaturedPlaylists(token)
  //     .then(res => res);
  // }
  const playlist = [
    'HIGHEST IN THE ROOM, Travis Scott',
    'EARFQUAKE, Tyler, The Creator',
    'Toosie Slide, Drake',
    'The Take (feat. Chris Brown), Tory Lanez',
    'Going Bad (feat. Drake), Meek Mill',
    'Suge, DaBaby',
    'Noticed, Lil Mosey',
    'ORANGE SODA, Baby Keem',
    'Praise The Lord (Da Shine) (feat. Skepta), A$AP Rocky',
    'BEST ON EARTH (feat. BIA) - Bonus, Russ',
    'Blue World, Mac Miller',
    'Somebody, Internet Money',
    'Tap (feat. Meek Mill), NAV',
    'G Walk (with Chris Brown), Lil Mosey',
    'Summertime In Paris, Jaden',
    'Heat (feat. Gunna), Chris Brown',
    'Racks in the Middle (feat. Roddy Ricch and Hit-Boy), Nipsey Hussle',
    'Love Me More, Trippie Redd',
    '90210 (feat. Kacy Hill), Travis Scott',
    '100 Degrees, Rich Brian',
    'Caught Up (feat. Khalid), Majid Jordan',
    'BIG, Young M.A',
    'I Think I Luv Her, Tyla Yaweh'
  ];

  return (
    <div className="Playlist">
      {playlist.map(track =>
        (<Track track={track}/>)
      )}
    </div>
  );
}

export default Playlist;