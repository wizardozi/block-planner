import { createContext, useContext } from 'react';

const DBContext = createContext(null);

export const DBProvider = ({ db, children }) => {
  const parent = useContext(DBContext);
  return (
    <DBContext.Provider value={db ?? parent}>{children}</DBContext.Provider>
  );
};

export const useDB = () => {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error('useDB must be inside <DBProvider>');
  return ctx;
};
