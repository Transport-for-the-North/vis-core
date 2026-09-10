import React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "Components/Navbar";
import { useWindowWidth } from "hooks/useWindowWidth";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthProvider";
import { buildNavbarLinks } from "utils";
import { AppContext } from "contexts";

jest.mock("hooks/useWindowWidth", () => ({
  useWindowWidth: jest.fn(),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
  };
});

jest.mock("contexts/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

jest.mock("utils", () => ({
  buildNavbarLinks: jest.fn(),
  validateAppConfigAgainstOpenApi: jest.fn(() => ({ errors: [], warnings: [] })),
}));

jest.mock("./Logo.jsx", () => ({
  Logo: ({ logoImage, position, onClick }) =>
    require("react").createElement("img", {
      src: logoImage,
      alt: "Logo",
      "data-position": position,
      onClick,
    }),
}));

jest.mock("./ResponsiveNavbarLinks.jsx", () => ({
  ResponsiveNavbarLinks: ({ links }) =>
    require("react").createElement(
      "div",
      null,
      links.map((link) =>
        require("react").createElement(
          "a",
          { key: link.url, href: link.url },
          link.label,
        ),
      ),
    ),
}));

jest.mock("./LateralNavbar.jsx", () => ({
  LateralNavbar: ({ className }) =>
    require("react").createElement("aside", {
      "data-testid": "lateral-navbar",
      "data-class": className,
    }),
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

describe("Navbar accessibility", () => {
  beforeEach(() => {
    useLocation.mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "k1",
    });
    useNavigate.mockReturnValue(jest.fn());
    useAuth.mockReturnValue({
      logOut: jest.fn(),
      user: { username: "test", roles: [] },
      token: "token",
      loginAction: jest.fn(),
    });
    buildNavbarLinks.mockReturnValue([
      { url: "/dashboard", label: "Dashboard" },
      { url: "/about", label: "About" },
    ]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("desktop navbar renders with no automated accessibility violations", async () => {
    useWindowWidth.mockReturnValue(1800);

    const appContext = {
      logoImage: "img/tfn-logo-fullsize.png",
      appPages: [],
      logoPosition: "left",
      authenticationRequired: true,
      apiSchema: {},
    };

    const { container } = render(
      <MemoryRouter>
        <AppContext.Provider value={appContext}>
          <Navbar />
        </AppContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("mobile navbar toggle has an accessible name and no automated violations", async () => {
    useWindowWidth.mockReturnValue(400);

    const appContext = {
      logoImage: "img/tfn-logo-fullsize.png",
      logoutButtonImage: "img/burger.png",
      appPages: [],
      logoPosition: "left",
      authenticationRequired: true,
      apiSchema: {},
    };

    const { container } = render(
      <MemoryRouter>
        <AppContext.Provider value={appContext}>
          <Navbar />
        </AppContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /open main menu/i })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
