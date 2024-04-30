import React, { createContext, useContext } from 'react';

// Create a context for the app configuration
export const PageContext = createContext();

// Create a custom hook to use the app config context
export const usePage = () => useContext(PageContext);

// Define the provider component
export const PageProvider = ({ children, config }) => {
  return (
    <PageContext.Provider value={config}>
      {children}
    </PageContext.Provider>
  );
};