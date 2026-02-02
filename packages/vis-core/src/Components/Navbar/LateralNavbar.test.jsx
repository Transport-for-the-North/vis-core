import { LateralNavbar } from "Components/Navbar/LateralNavbar";
import { render, screen } from "@testing-library/react";
import { AppContext } from "contexts";
import { MemoryRouter, useLocation } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";

const fakeOnClick = jest.fn();
const props = {
  $bgColor: "#7317de",
  className: "sideNavbar-shown",
  onClick: fakeOnClick,
};
const returnedValueUseLocation = {
  hash: "",
  key: "default",
  pathname: "/pathname",
  search: "",
  state: null,
};
const mockAppContext = {
  apiSchema: {
    components: {},
    info: { title: "title", version: "V1" },
    openapi: "3.0.1",
    paths: "/paths",
    security: [],
  },
  appPages: [
    {
      about: "<p>about</p>",
      category: "category1",
      config: {},
      legalText: "<p>legalText</p>",
      pageName: "pageName",
      termsOfUse: "<p>termsOfUse</p>",
      type: "MapLayout",
      url: "/url",
    },
    {
      about: "<p>about2</p>",
      category: "category2",
      config: {},
      legalText: "<p>legalText2</p>",
      pageName: "pageName2",
      termsOfUse: "<p>termsOfUse2</p>",
      type: "MapLayout2",
      url: "/url2",
      navbarLinkBgColour: "#8b4242ff",
    },
    {
      about: "<p>about3</p>",
      category: "category2",
      config: {},
      legalText: "<p>legalText3</p>",
      pageName: "pageName3",
      termsOfUse: "<p>termsOfUse3</p>",
      type: "MapLayout3",
      url: "/url3",
      navbarLinkBgColour: "#8b4242ff",
    },
  ],
  authenticationRequired: true,
  background: "",
  backgroundImage: "img/hero-image.jpg",
  contactEmail: "firstname.lastname@transportforthenorth.com",
  contactText: "Please contact [Name] for any questions on this data tool.",
  defaultBands: [],
  introduction:
    '<p>HTML, or HyperText Markup Language, is the standard markup language used to create web pages. It provides the structure of a webpage, allowing for the insertion of text, images, and other multimedia elements. HTML is not a programming language; it is a markup language that defines the content of web pages.</p>\n    <p>HTML documents are made up of elements. These elements are represented by tags, which label pieces of content such as "heading", "paragraph", "list", and so on. Browsers do not display the HTML tags but use them to render the content of the page.</p>\n    <h2>Basic HTML Page Structure</h2>\n    <p>An HTML document has a defined structure that includes the following main elements:</p>\n    <ul>\n        <li><strong>DOCTYPE declaration:</strong> Defines the document type and version of HTML.</li>\n        <li><strong>html element:</strong> This is the root element that encloses all the content of an HTML document.</li>\n        <li><strong>head element:</strong> Contains meta-information about the document, such as its title and links to scripts and stylesheets.</li>\n        <li><strong>body element:</strong> Contains the content of the document, such as text, images, and other media.</li>\n    </ul>\n    <p>Learning HTML is the first step in creating web content and is essential for web developers. It is easy to learn and can be combined with CSS (Cascading Style Sheets) and JavaScript to create interactive and styled web pages.</p>',
  legalText:
    '<p>For our terms of use, please see the <a href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" target="_blank">Open Government Licence</a>. Use of the Bus Analytical Tool also indicates your acceptance of this <a href="https://transportforthenorth.com/about-transport-for-the-north/transparency/" target="_blank">Disclaimer and Appropriate Use Statement</a>.</p>',
  logoImage: "img/tfn-logo-fullsize.png",
  logoutButtonImage: "img/burgerIcon.png",
  logoutImage: "img/logout.png",
  methodology: "",
  title: "TAME React Vis Template",
  externalLinks: [
    {
      category: "category1",
      url: "/urlExternal1",
      pageName: "External1",
      external: true,
      navbarLinkBgColour: "#8b4242ff",
    },
    {
      category: "category2",
      url: "/urlExternal2",
      label: "External2",
      external: true,
    },
    {
      category: null,
      url: "/urlExternal3",
      label: "External3",
      external: true,
    },
  ],
};
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => returnedValueUseLocation,
}));

const theme = {
  navbarBg: "#21BCFF",
  activeBg: "#432DD7",
  navText: "#62748E",
};

describe("LateralNavbar component test", () => {
  it("basic functionality test", async () => {
    render(
      <MemoryRouter>
        <AppContext.Provider value={mockAppContext}>
          <ThemeProvider theme={theme}>
            <LateralNavbar {...props} />
          </ThemeProvider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    const home = screen.getByText("Home");
    expect(home).toBeInTheDocument();
    expect(home).toHaveAttribute("href", "/");

    const noCategory = screen.getByText("pageName");
    const noCategory2 = screen.getByText("pageName2");
    expect(noCategory).toBeInTheDocument();
    expect(noCategory2).toBeInTheDocument();
    expect(noCategory2).toHaveAttribute("href", "/url2");
    expect(noCategory).toHaveAttribute("href", "/url");
  });
  it("basic functionality test with multiple categories and an externals categories", async () => {
    render(
      <MemoryRouter>
        <AppContext.Provider value={mockAppContext}>
          <ThemeProvider theme={theme}>
            <LateralNavbar {...props} />
          </ThemeProvider>
        </AppContext.Provider>
      </MemoryRouter>
    );

    // Categories
    const firstCategory = screen.getByText("category1");
    const secondCategory = screen.getByText("category2");
    expect(firstCategory).toBeInTheDocument();
    expect(secondCategory).toBeInTheDocument();

    // Simulate click on a nav item
    const item = screen.getByText("pageName");
    await userEvent.click(item);
    expect(fakeOnClick).toHaveBeenCalled();

    // External links
    const external2 = screen.getByText("External2");
    expect(external2).toBeInTheDocument();
    expect(external2).toHaveAttribute("href", "/urlExternal2");

    // External link with no category
    const external3 = screen.getByText("External3");
    expect(external3).toBeInTheDocument();
    expect(external3).toHaveAttribute("href", "/urlExternal3");
  });
});
