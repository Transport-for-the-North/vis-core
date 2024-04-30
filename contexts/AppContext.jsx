import React, { createContext, useContext } from 'react';

// Create a context for the app configuration
export const AppContext = createContext();

// Create a custom hook to use the app config context
export const useAppContext = () => useContext(AppContext);

// Define the provider component
export const AppContextProvider = ({ children, config }) => {
  return (
    <AppContext.Provider value={config}>
      {children}
    </AppContext.Provider>
  );
};