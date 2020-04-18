import { createContext, useContext } from 'react';

const AuthContext = createContext();

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context;
}

export { AuthContext, useAuth };