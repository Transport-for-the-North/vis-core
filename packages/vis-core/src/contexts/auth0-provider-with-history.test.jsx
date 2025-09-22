import { Auth0ProviderWithHistory } from "./auth0-provider-with-history";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));
jest.mock("@auth0/auth0-react", () => ({
  Auth0Provider: jest.fn(({ children }) => children),
}));

describe("Auth0ProviderWithHistory context test", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // jest.resetModules();
    process.env = {
      ...originalEnv,
      REACT_APP_AUTH0_DOMAIN: "test.auth0.com",
      REACT_APP_AUTH0_CLIENT_ID: "test-client-id",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Auth0ProviderWithHistory>
          <div>Test Child</div>
        </Auth0ProviderWithHistory>
      </MemoryRouter>
    );
    expect(screen.getByText("Test Child")).toBeInTheDocument();
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
      }),
      expect.anything()
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
