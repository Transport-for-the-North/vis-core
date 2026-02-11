import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("@auth0/auth0-react", () => {
  const React = require("react");
  return {
    Auth0Provider: jest.fn(({ children }) => (
      React.createElement("div", { "data-testid": "mock-auth0-provider" }, children)
    )),
  };
});

import { Auth0ProviderWithHistory } from "./auth0-provider-with-history";

describe("Auth0ProviderWithHistory context test", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // jest.resetModules();
    process.env = {
      ...originalEnv,
      REACT_APP_AUTH0_DOMAIN: "test.auth0.com",
      REACT_APP_AUTH0_CLIENT_ID: "test-client-id",
    };
    const { Auth0Provider } = require("@auth0/auth0-react");
    Auth0Provider.mockClear();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { Auth0Provider } = require("@auth0/auth0-react");
    
    // Just verify the component can render without throwing
    const { container } = render(
      <MemoryRouter>
        <Auth0ProviderWithHistory>
          <div>Test Child</div>
        </Auth0ProviderWithHistory>
      </MemoryRouter>
    );
    
    // Verify that Auth0Provider was called (component rendered successfully)
    expect(Auth0Provider).toHaveBeenCalled();
    // Verify the container exists
    expect(container).toBeInTheDocument();
  });

  it("passes correct props to Auth0Provider", () => {
    const { Auth0Provider } = require("@auth0/auth0-react");
    
    render(
      <MemoryRouter>
        <Auth0ProviderWithHistory>
          <div>Test Child</div>
        </Auth0ProviderWithHistory>
      </MemoryRouter>
    );

    expect(Auth0Provider).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: "test.auth0.com",
        clientId: "test-client-id",
        redirectUri: window.location.origin,
        onRedirectCallback: expect.any(Function),
        children: expect.anything(),
      }),
      {}
    );
  });

  it("handles onRedirectCallback with returnTo", () => {
    const { Auth0Provider } = require("@auth0/auth0-react");
    
    render(
      <MemoryRouter>
        <Auth0ProviderWithHistory>
          <div>Test Child</div>
        </Auth0ProviderWithHistory>
      </MemoryRouter>
    );

    const onRedirectCallback =
      Auth0Provider.mock.calls[0][0].onRedirectCallback;

    onRedirectCallback({ returnTo: "/dashboard" });
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("handles onRedirectCallback without returnTo", () => {
    const { Auth0Provider } = require("@auth0/auth0-react");
    
    render(
      <MemoryRouter>
        <Auth0ProviderWithHistory>
          <div>Test Child</div>
        </Auth0ProviderWithHistory>
      </MemoryRouter>
    );

    const onRedirectCallback =
      Auth0Provider.mock.calls[0][0].onRedirectCallback;

    mockedUsedNavigate.mockClear();
    onRedirectCallback({});
    expect(mockedUsedNavigate).toHaveBeenCalledWith(window.location.pathname);
  });
});
