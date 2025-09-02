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

  // To continue
  it.skip("Renders the homePage where we're connected", async () => {
    // Mock the function withRoleValidation to return the component directly
    // JE NE PEUX PAS MOCK ICI CAR JAI UN MESSAGE DERREUR : Invalid variable access: _jsxFileName
    // jest.doMock("../../hocs/withRoleValidation.jsx", () => ({
    //   withRoleValidation: (Component) => {
    //     return (props) => <Component {...props} />;
    //   },
    // }));
    // jest.doMock("js-cookie", () => ({
    //   get: jest.fn(() => "mockToken"),
    // }));

    // jest.doMock("jwt-decode", () => ({
    //   jwtDecode: jest.fn(() => ({
    //     "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": [
    //       "All_Admin",
    //       "All_superuser_role",
    //       "All_User",
    //     ],
    //   })),
    // }));


    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("HomePage")).toBeInTheDocument();
    });
  });
});
