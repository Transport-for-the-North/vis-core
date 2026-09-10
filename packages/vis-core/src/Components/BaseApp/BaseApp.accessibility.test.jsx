import { render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import { BaseApp } from "Components/BaseApp/BaseApp";

jest.mock("js-cookie", () => ({
  default: { get: jest.fn(), set: jest.fn(), remove: jest.fn() },
}));

jest.mock("utils", () => ({
  loadBands: jest.fn(() => Promise.resolve([])),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

jest.mock("maplibre-gl", () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    addLayer: jest.fn(),
    setStyle: jest.fn(),
    flyTo: jest.fn(),
  })),
}));

jest.mock("services", () => ({
  api: {
    metadataService: {
      getSwaggerFile: jest.fn(() => Promise.resolve({ swagger: "mockSchema" })),
    },
  },
}));

jest.mock("Components/PageSwitch", () => ({
  PageSwitch: () => <main><h1>PageSwitch</h1></main>,
}));
jest.mock("Components/HomePage", () => ({
  HomePage: () => <main><h1>HomePage</h1></main>,
}));
jest.mock("Components/Navbar", () => ({
  Navbar: () => <nav aria-label="Main navigation"><a href="/">Home</a></nav>,
}));
jest.mock("Components/Login", () => ({ Login: () => <main><h1>Login</h1></main> }));
jest.mock("Components/Login/Unauthorised", () => ({
  Unauthorized: () => <main><h1>Unauthorized</h1></main>,
}));
jest.mock("Components/TermsOfUse", () => ({
  TermsOfUse: () => <div>TermsOfUse</div>,
}));
jest.mock("Components/NotFoundPage/NotFoundPage", () => ({
  NotFound: () => <main><h1>NotFound</h1></main>,
}));

jest.mock("layouts", () => ({
  Dashboard: ({ children }) => <div>{children}</div>,
}));

jest.mock("contexts", () => ({
  AppContext: { Provider: ({ children }) => children },
  AuthProvider: ({ children }) => children,
  ErrorProvider: ({ children }) => children,
}));

jest.mock("hocs", () => ({
  withRoleValidation: jest.fn((Component) => Component),
  withWarning: jest.fn((Component) => Component),
  composeHOCs: jest.fn(() => (Component) => Component),
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

describe("BaseApp accessibility", () => {
  it("renders home route without automated accessibility violations", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <BaseApp {...defaultProps} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    }, { timeout: 3000 });

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
