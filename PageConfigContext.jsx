import React, { createContext, useContext } from 'react';

// Create a context for the app configuration
export const PageConfigContext = createContext();

// Create a custom hook to use the app config context
export const usePageConfig = () => useContext(PageConfigContext);

// Define the provider component
export const PageConfigProvider = ({ children, config }) => {
  return (
    <PageConfigContext.Provider value={config}>
      {children}
    </PageConfigContext.Provider>
  );
};