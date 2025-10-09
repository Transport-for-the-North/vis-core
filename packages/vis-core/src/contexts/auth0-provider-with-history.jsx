import React from 'react';
import { useNavigate  } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

/**
 * Auth0ProviderWithHistory component that integrates Auth0 with React Router's history.
 * This component wraps the Auth0Provider from the Auth0 React SDK and configures it to use
 * React Router's history for navigation after authentication.
 *
 * @function Auth0ProviderWithHistory
 * @param {React.ReactNode} children - The child components to be wrapped by the Auth0Provider.
 * @returns {JSX.Element} The Auth0Provider component wrapping the children with authentication context.
 */
export const Auth0ProviderWithHistory = ({ children }) => {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

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
