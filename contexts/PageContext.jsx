import React, { createContext, useContext } from 'react';

// Create a context for the app configuration
export const PageContext = createContext();

/**
 * Custom hook to use the PageContext.
 * @function usePage
 * @returns {Object} The context value.
 */
export const usePage = () => useContext(PageContext);

/**
 * PageProvider component to provide the page configuration context.
 * @function PageProvider
 * @param {React.ReactNode} children - Child components to be wrapped by the context provider.
 * @param {Object} config - Configuration object to be provided through context.
 * @returns {JSX.Element} The page context provider component.
 */
export const PageProvider = ({ children, config }) => {
  return (
    <PageContext.Provider value={config}>
      {children}
    </PageContext.Provider>
  );
};