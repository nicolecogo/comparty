import { createContext, useContext } from 'react';

const PlaylistContext = createContext();

function usePlaylist() {
  const context = useContext(PlaylistContext)
  if (context === undefined) {
    throw new Error(`usePlaylist must be used within a PlayerProvider`)
  }
  return context;
}

export { PlaylistContext, usePlaylist };