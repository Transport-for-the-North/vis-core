import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BaseApp } from "Components/BaseApp/BaseApp";

jest.mock("js-cookie", () => ({
  default: { get: jest.fn(), set: jest.fn(), remove: jest.fn() },
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

jest.mock("../../services", () => ({
  api: {
    metadataService: {
      getSwaggerFile: jest.fn(() => Promise.resolve({ swagger: "mockSchema" })),
    },
  },
}));

jest.mock("../index", () => ({
  PageSwitch: () => <div>PageSwitch</div>,
  HomePage: () => <div>HomePage</div>,
  Navbar: () => <div>Navbar</div>,
  Login: () => <div>Login</div>,
  Unauthorized: () => <div>Unauthorized</div>,
  TermsOfUse: () => <div>TermsOfUse</div>,
  NotFound: () => <div>NotFound</div>,
}));

jest.mock("../../layouts", () => ({
  Dashboard: ({ children }) => <div>{children}</div>,
}));

jest.mock("../../contexts", () => ({
  AppContext: { Provider: ({ children }) => children },
  AuthProvider: ({ children }) => children,
  ErrorProvider: ({ children }) => children,
}));

jest.mock("../../hocs", () => ({
  withRoleValidation: jest.fn((Component) => Component),
  withWarning: jest.fn((Component) => Component),
  withTermsOfUse: jest.fn((Component) => Component),
  composeHOCs: jest.fn(() => (Component) => Component),
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
});