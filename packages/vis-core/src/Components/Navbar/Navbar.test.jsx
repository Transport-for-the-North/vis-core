import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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
jest.mock("./Button.jsx", () => ({
  Button: ({ src, alt, onClick }) =>
    require("react").createElement(
      "button",
      { type: "button", onClick },
      require("react").createElement("img", { src, alt })
    ),
}));
jest.mock("./ResponsiveNavbarLinks.jsx", () => ({
  ResponsiveNavbarLinks: ({ links }) =>
    require("react").createElement("nav", {
      "data-testid": "responsive-links",
      children: `links:${links.length}`,
    }),
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

describe("Navbar", () => {
  const mockNavigate = jest.fn();
  const mockLogOut = jest.fn();

  beforeEach(() => {
    useWindowWidth.mockReturnValue(400); // default mobile
    useLocation.mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      logOut: mockLogOut,
      user: { username: "test", roles: [] },
      token: "fake_token",
      loginAction: jest.fn(),
    });
    buildNavbarLinks.mockReturnValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays the burger button and logo on mobile devices", () => {
    const appContext = {
      logoImage: "img/tfn-logo-fullsize.png",
      logoutButtonImage: "img/burger.png",
      appPages: [],
      logoPosition: "left",
      authenticationRequired: true,
    };

    render(
      <MemoryRouter>
        <AppContext.Provider value={appContext}>
          <Navbar />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // The Button (burger) is rendered with an image with the alt text ‘Burger Button Navbar’.
    expect(screen.getByAltText(/Burger Button Navbar/i)).toBeInTheDocument();
    // The mocked logo has the alt text ‘Logo’.
    expect(screen.getByAltText(/Logo/i)).toBeInTheDocument();
  });

  it("does not return anything on the /login route", () => {
    useLocation.mockReturnValue({ pathname: "/login", search: "", hash: "", state: null, key: "k1" });

    const appContext = {
      logoImage: "img/tfn-logo-fullsize.png",
      appPages: [],
      authenticationRequired: false,
    };

    const { container } = render(
      <MemoryRouter>
        <AppContext.Provider value={appContext}>
          <Navbar />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // the component returns null -> no navbar in the DOM
    // we check that there is no fixed element (height spacer present if Navbar rendered)
    // here we search for the burger button and the logo: they must not be found
    expect(screen.queryByAltText(/Burger Button Navbar/i)).not.toBeInTheDocument();
    expect(screen.queryByAltText(/Logo/i)).not.toBeInTheDocument();
  });

  it("Calls logOut when the logout icon is clicked and authenticationRequired=true", () => {
    // default mobile (useWindowWidth 400). We want StyledLogout to be rendered.
    const appContext = {
      logoImage: "img/tfn-logo-fullsize.png",
      appPages: [],
      authenticationRequired: true,
    };

    const { container } = render(
      <MemoryRouter>
        <AppContext.Provider value={appContext}>
          <Navbar />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // The logout button is rendered with an image with the src ‘/img/logout.png’.
    const logoutImg = container.querySelector('img[src="/img/logout.png"]');
    expect(logoutImg).toBeInTheDocument();

    fireEvent.click(logoutImg);
    expect(mockLogOut).toHaveBeenCalled();
  });

  it("displays responsive links on desktop (not mobile)", () => {
    useWindowWidth.mockReturnValue(1200); // desktop
    buildNavbarLinks.mockReturnValue([{ url: "/a", label: "A" }, { url: "/b", label: "B" }]);

    const appContext = {
      logoImage: "img/tfn-logo-fullsize.png",
      appPages: [],
      logoPosition: "left",
      authenticationRequired: false,
    };

    render(
      <MemoryRouter>
        <AppContext.Provider value={appContext}>
          <Navbar />
        </AppContext.Provider>
      </MemoryRouter>
    );

    // We mocked ResponsiveNavbarLinks to expose data-testid.
    expect(screen.getByTestId("responsive-links")).toBeInTheDocument();
    expect(screen.queryByAltText(/Burger Button Navbar/i)).not.toBeInTheDocument();
  });
});