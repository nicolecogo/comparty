import { createContext, useContext } from 'react';

const UserContext = createContext();

function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`)
  }
  return context;
}

export { UserContext, useUser };