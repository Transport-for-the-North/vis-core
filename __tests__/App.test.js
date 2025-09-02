jest.mock("js-cookie", () => ({
  get: jest.fn(),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));
jest.mock("../../configs/dev/appConfig.js", () => ({
  appConfig: {
    authenticationRequired: true,
    appPages: [],
    loadBands: jest.fn(/* () => Promise.resolve(["band1", "band2"]) */),
  },
}));

jest.mock("../../configs/dev/bands.js", () => ({
  bands: ["band1", "band2"],
}));

jest.mock("../../services", () => ({
  api: {
    metadataService: {
      getSwaggerFile: jest.fn(() => Promise.resolve({ swagger: "mockSchema" })),
    },
  },
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

jest.mock("../../Components", () => ({
  HomePage: () => <div>HomePage</div>,
  Navbar: () => <div>Navbar</div>,
  Login: () => <div>Login</div>,
  Unauthorized: () => <div>Unauthorized</div>,
  TermsOfUse: () => <div>TermsOfUse</div>,
  PageSwitch: () => <div>PageSwitch</div>,
}));

import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { render, screen, waitFor } from "@testing-library/react";
import App from "../../App";
import { MemoryRouter } from "react-router-dom";

process.env.REACT_APP_NAME = "dev";

describe("App Component", () => {
  it("Renders the login page because we're not connect", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Login")).toBeInTheDocument();
    });
  });
  it("Renders the unauthorized page", async () => {
    render(
      <MemoryRouter initialEntries={["/unauthorized"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Unauthorized")).toBeInTheDocument();
    });
  });

  it("Renders the homePage where we're connected", async () => {
    
    // Define the REACT_APP_NAME in "dev"
    process.env.REACT_APP_NAME = "dev";

    Cookies.get.mockReturnValue("fake-jwt-token");
    jwtDecode.mockReturnValue({
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": ["dev_user", "all_user"]
    });
    jest.mock("../../hocs", () => ({
      withRoleValidation: jest.fn((Component) => Component),
      withWarning: jest.fn((Component) => Component),
      withTermsOfUse: jest.fn((Component) => Component),
      composeHOCs: jest.fn(
        (...hocs) =>
          (Component) =>
            Component
      ),
    }));
    jest.mock("../../configs/dev/bands.js", () => ({
      bands: [{ name: "name", metric: [] }],
    }));
    jest.mock("../../configs/dev/appConfig.js", () => ({
      appConfig: {
        title: "TAME React Vis Template",
        introduction: "Test introduction",
        background: "",
        methodology: "",
        legalText: "Test legal text",
        contactText: "Test contact",
        contactEmail: "test@example.com",
        logoImage: "img/test-logo.png",
        backgroundImage: "img/test-bg.jpg",
        logoutButtonImage: "img/test-burger.png",
        logoutImage: "img/test-logout.png",
        appPages: [
          {
            id: "page1",
            name: "Test Page 1",
          }
        ],
        authenticationRequired: false,
        loadBands: jest.fn().mockResolvedValue([
          {
            name: "fallbackBand",
            metric: ["fallbackMetric"],
          },
        ]),
      },
    }));

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });
});
