import React, { createContext, useContext } from 'react';

// Create a context for the app configuration
export const AppConfigContext = createContext();

// Create a custom hook to use the app config context
export const useAppConfig = () => useContext(AppConfigContext);

// Define the provider component
export const AppConfigProvider = ({ children, config }) => {
  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
};