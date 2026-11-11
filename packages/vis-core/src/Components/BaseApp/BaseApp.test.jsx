import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BaseApp } from "Components/BaseApp/BaseApp";
import { api } from "services";
import { normaliseStartupError } from "utils";
import { errorActionTypes } from "../../reducers";


jest.mock("js-cookie", () => ({
  default: { get: jest.fn(), set: jest.fn(), remove: jest.fn() },
}));

jest.mock("utils", () => ({
  loadBands: jest.fn(),
  getAnalyticsConsent: jest.fn(() => null),
  setAnalyticsConsent: jest.fn(),
  applyClarityConsent: jest.fn(),
  ANALYTICS_CONSENT_ACCEPTED: "accepted",
  ANALYTICS_CONSENT_REJECTED: "rejected",
  normaliseStartupError: jest.fn((error) => ({
    title: "Test startup error",
    message: error.message,
  })),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

jest.mock("maplibre-gl", () => ({
  Map: jest.fn(() => ({
    on: jest.fn(), off: jest.fn(), remove: jest.fn(),
    addLayer: jest.fn(), setStyle: jest.fn(), flyTo: jest.fn(),
  })),
}));

jest.mock("services", () => ({
  api: {
    metadataService: {
      getSwaggerFile: jest.fn(() => Promise.resolve({ swagger: "mockSchema" })),
    },
  },
}));

jest.mock("Components/PageSwitch", () => ({ PageSwitch: () => <div>PageSwitch</div> }));
jest.mock("Components/HomePage", () => ({ HomePage: () => <div>HomePage</div> }));
jest.mock("Components/Navbar", () => ({ Navbar: () => <div>Navbar</div> }));
jest.mock("Components/Login", () => ({ Login: () => <div>Login</div> }));
jest.mock("Components/Login/Unauthorised", () => ({ Unauthorized: () => <div>Unauthorized</div> }));
jest.mock("Components/TermsOfUse", () => ({ TermsOfUse: () => <div>TermsOfUse</div> }));
jest.mock("Components/NotFoundPage/NotFoundPage", () => ({ NotFound: () => <div>NotFound</div> }));

jest.mock("layouts", () => ({
  Dashboard: ({ children }) => <div>{children}</div>,
}));

jest.mock("contexts", () => {
  const React = require("react");
  const mockDispatch = jest.fn();

  return {
    AppContext: { Provider: ({ children }) => children },
    ErrorContext: React.createContext({ dispatch: mockDispatch }),
    AuthProvider: ({ children }) => children,
    useAuth: () => ({ token: "" }),
    ErrorProvider: ({ children }) => children,
    __mockDispatch: mockDispatch,
  };
});

const { __mockDispatch: mockDispatch } = jest.requireMock("contexts");

jest.mock("hocs", () => ({
  withRoleValidation: jest.fn((Component) => Component),
  withWarning: jest.fn((Component) => Component),
  composeHOCs: jest.fn((...hocs) => (Component) => Component),
  withTermsOfUse: jest.fn((Component) => Component),
}));

const mockConfigLoader = () => ({
  "./configs/test-app/appConfig.js": () => Promise.resolve({
    appConfig: {
      title: "Test App",
      appPages: [],
      authenticationRequired: false,
    },
  }),
});

const mockBandsLoader = () => ({
  "./configs/test-app/bands.js": () => Promise.resolve({
    bands: [],
  }),
});

const defaultProps = {
  theme: {},
  configLoader: mockConfigLoader,
  bandsLoader: mockBandsLoader,
  appName: "test-app",
  appCssClass: "App",
};

describe("BaseApp", () => {
  it("shows loading state before config loads", () => {
    render(
      <MemoryRouter>
        <BaseApp {...defaultProps} />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders app content after config loads", async () => {
    render(
      <MemoryRouter>
        <BaseApp {...defaultProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByText("Navbar")).toBeInTheDocument();
  });

  it("renders Login page when navigating to /login", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <BaseApp {...defaultProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("renders Unauthorized page when navigating to /unauthorized", async () => {
    render(
      <MemoryRouter initialEntries={["/unauthorized"]}>
        <BaseApp {...defaultProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("renders HomePage when auth is not required", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <BaseApp {...defaultProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("HomePage")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("applies custom CSS class to app wrapper", async () => {
    const { container } = render(
      <MemoryRouter>
        <BaseApp {...defaultProps} appCssClass="CustomApp" />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(container.querySelector(".CustomApp")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it("shows error when appName is not provided", async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <MemoryRouter>
        <BaseApp {...defaultProps} appName={null} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load app configuration:",
        expect.any(Error)
      );
    }, { timeout: 3000 });

    consoleSpy.mockRestore();
  });

  it("normalises and dispatches an error when Swagger loading fails", async () => {
    const error = Object.assign(new Error("Access denied"), {
      status: 403,
      url: "/swagger/v1/swagger.json",
    });

    const normalizedError = {
    title: "Test startup error",
    message: "Access denied",
    };

    normaliseStartupError.mockReturnValue(normalizedError);
    api.metadataService.getSwaggerFile.mockRejectedValueOnce(error);
    mockDispatch.mockClear();

    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/"]}>
        <BaseApp {...defaultProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(normaliseStartupError).toHaveBeenCalledWith(error);
      expect(mockDispatch).toHaveBeenCalledWith({
        type: errorActionTypes.SET_ERROR,
        payload: 
          normalizedError,
      });
    }, { timeout: 3000 });

    consoleSpy.mockRestore();
  });
});