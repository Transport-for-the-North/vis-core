import React from 'react';
import { useNavigate  } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

/**
 * @deprecated This Auth0 provider is no longer used in the vis-core package.
 * The package now uses a custom JWT-based authentication system via AuthProvider.jsx
 * This file is kept for reference but should not be used in new implementations.
 * 
 * Auth0ProviderWithHistory component that integrates Auth0 with React Router's history.
 * This component wraps the Auth0Provider from the Auth0 React SDK and configures it to use
 * React Router's history for navigation after authentication.
 *
 * @function Auth0ProviderWithHistory
 * @param {React.ReactNode} children - The child components to be wrapped by the Auth0Provider.
 * @returns {JSX.Element} The Auth0Provider component wrapping the children with authentication context.
 */
export const Auth0ProviderWithHistory = ({ children }) => {
  console.warn('Auth0ProviderWithHistory is deprecated. Use AuthProvider instead.');
  
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

  const navigate = useNavigate();

  /**
   * Callback function to handle redirection after login.
   * @function onRedirectCallback
   * @param {Object} appState - The state of the application.
   * @param {string} appState.returnTo - The URL to return to after login.
   */
  const onRedirectCallback = (appState) => {
    navigate(appState.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};