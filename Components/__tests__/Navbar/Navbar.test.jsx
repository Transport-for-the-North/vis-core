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

// Optionnel : si tu veux isoler complètement Navbar, tu peux mocker des composants enfants.
// Ils doivent être mockés en utilisant exactement le même identifiant que dans l'import du fichier Navbar.
// Ici j'utilise des mocks très simples pour Logo, Button, ResponsiveNavbarLinks, LateralNavbar.
// Ajuste les chemins si ton projet utilise des alias différents.
jest.mock("../../Navbar/Logo", () => ({
  Logo: ({ logoImage, position, onClick }) =>
    // affichage simple avec alt pour pouvoir le rechercher dans les tests
    require("react").createElement("img", {
      src: logoImage,
      alt: "Logo",
      "data-position": position,
      onClick,
    }),
}));
jest.mock("../../Navbar/Button", () => ({
  Button: ({ src, alt, onClick }) =>
    require("react").createElement(
      "button",
      { type: "button", onClick },
      require("react").createElement("img", { src, alt })
    ),
}));
jest.mock("../../Navbar/ResponsiveNavbarLinks", () => ({
  ResponsiveNavbarLinks: ({ links }) =>
    require("react").createElement("nav", {
      "data-testid": "responsive-links",
      children: `links:${links.length}`,
    }),
}));
jest.mock("../../Navbar/LateralNavbar", () => ({
  LateralNavbar: ({ className }) =>
    require("react").createElement("aside", {
      "data-testid": "lateral-navbar",
      "data-class": className,
    }),
}));

// Now import (after mocks)
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "Components/Navbar"; // adapte l'import si nécessaire
import { useWindowWidth } from "hooks/useWindowWidth";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthProvider";
import { buildNavbarLinks } from "utils";
import { AppContext } from "contexts"; // adapte le chemin si besoin

describe("Navbar", () => {
  const mockNavigate = jest.fn();
  const mockLogOut = jest.fn();

  beforeEach(() => {
    // valeur par défaut des mocks — tu peux overrider par test
    useWindowWidth.mockReturnValue(400); // mobile par défaut
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
    buildNavbarLinks.mockReturnValue([]); // pas de liens par défaut
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("affiche le bouton burger et le logo en mobile", () => {
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

    // Le Button (burger) est rendu avec une image ayant l'alt "Burger Button Navbar"
    expect(screen.getByAltText(/Burger Button Navbar/i)).toBeInTheDocument();
    // Le Logo mocké a l'alt "Logo"
    expect(screen.getByAltText(/Logo/i)).toBeInTheDocument();
  });

  it("ne rend rien sur la route /login", () => {
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

    // le composant retourne null -> pas de navbar dans le DOM
    // on vérifie qu'il n'y a pas l'élément fixed (height spacer présent si Navbar rendu)
    // ici on recherche le bouton burger et le logo : ils ne doivent pas être trouvés
    expect(screen.queryByAltText(/Burger Button Navbar/i)).not.toBeInTheDocument();
    expect(screen.queryByAltText(/Logo/i)).not.toBeInTheDocument();
    // éventuellement container.firstChild === null
  });

  it("appelle logOut quand on clique sur l'icône logout et authenticationRequired=true", () => {
    // mobile par défaut (useWindowWidth 400). On veut que StyledLogout soit rendu.
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

    // StyledLogout n'a pas d'alt dans ton composant original ; on le récupère via src
    const logoutImg = container.querySelector('img[src="/img/logout.png"]');
    expect(logoutImg).toBeInTheDocument();

    fireEvent.click(logoutImg);
    expect(mockLogOut).toHaveBeenCalled();
  });

  it("affiche les liens responsives en desktop (non mobile)", () => {
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

    // On avait mocké ResponsiveNavbarLinks pour exposer data-testid
    expect(screen.getByTestId("responsive-links")).toBeInTheDocument();
    expect(screen.queryByAltText(/Burger Button Navbar/i)).not.toBeInTheDocument();
  });
});