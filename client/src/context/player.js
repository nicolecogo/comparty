import { createContext, useContext } from 'react';

const PlayerContext = createContext();

function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error(`usePlayer must be used within a PlayerProvider`)
  }
  return context;
}

export { PlayerContext, usePlayer };