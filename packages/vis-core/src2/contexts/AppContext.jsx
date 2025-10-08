import React, { createContext, useContext } from 'react';

// Create a context for the app configuration
export const AppContext = createContext();

// Create a custom hook to use the app config context
export const useAppContext = () => useContext(AppContext);

/**
 * Provider component for the app configuration context.
 * @component AppContextProvider
 * @property {Object} config - The configuration object to provide.
 * @roperty {React.ReactNode} children - The child components to wrap with the provider.
 * @returns {JSX.Element} The AppContext provider component.
 */
export const AppContextProvider = ({ children, config }) => {
  return (
    <AppContext.Provider value={config}>
      {children}
    </AppContext.Provider>
  );
};