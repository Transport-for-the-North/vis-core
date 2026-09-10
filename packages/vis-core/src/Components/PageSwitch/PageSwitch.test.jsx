import { render, screen } from "@testing-library/react";
import { PageSwitch } from ".";
// Mocks
jest.mock("Components/MapLayout/MapLayout", () => ({ MapLayout: () => <div data-testid="mock-map-layout" /> }));
  jest.mock("Components/IFrameEmbedPage/IFrameEmbedPage", () => ({ IFrameEmbedPage: () => <div data-testid="mock-iframe-embed-page" /> }));
jest.mock("Components/CoordinatePreviewMap/CoordinatePreviewMap", () => ({
  CoordinatePreviewMap: () => <div data-testid="mock-coordinate-preview-map" />,
}));
jest.mock("contexts", () => ({
  FilterProvider: ({ children }) => (
    <div data-testid="mock-filter-provider">{children}</div>
  ),
  MapProvider: ({ children }) => (
    <div data-testid="mock-map-provider">{children}</div>
  ),
  PageContext: {
    Provider: ({ children }) => (
      <div data-testid="mock-page-context">{children}</div>
    ),
  },
}));

const bngFormPageConfig = {
  type: "FormPage",
  pageTitle: "Housing Site Submission",
  pageDescription: "Submit a site",
  config: {
    showMapPreview: true,
    coordinateSystem: "BNG",
    bgColor: "#0066cc",
    formConfig: {
      title: "Site Details",
      submitEndpoint: "/api/site-records",
      fields: [
        { id: "site_name", name: "site_name", label: "Site Name", type: "text", required: true },
        { id: "easting", name: "easting", label: "Easting", type: "integer", required: true },
        { id: "northing", name: "northing", label: "Northing", type: "integer", required: true },
        { id: "site_area_ha", name: "site_area_ha", label: "Site Area (ha)", type: "integer" },
      ],
    },
  },
};

describe("PageSwitch Component", () => {
  it("pageConfig.type null", () => {
    render(<PageSwitch pageConfig={{}} />);
    expect(screen.getByText("Nothing")).toBeInTheDocument();
  });
  it("pageConfig.type unknown", () => {
    render(<PageSwitch pageConfig={{type: 'ImUnknown'}} />);
    expect(screen.getByText("Nothing")).toBeInTheDocument();
  });

  it("Case pageConfig.type = DualMapLayout", async () => {
    render(<PageSwitch pageConfig={{ type: "DualMapLayout" }} />);

    const pageContext = screen.getByTestId("mock-page-context");
    const filterProvider = screen.getByTestId("mock-filter-provider");
    const mapProvider = screen.getByTestId("mock-map-provider");
    const mapLayout = screen.getByTestId("mock-map-layout");
    expect(pageContext).toBeInTheDocument();
    expect(filterProvider).toBeInTheDocument();
    expect(mapProvider).toBeInTheDocument();
    expect(mapLayout).toBeInTheDocument();
  });
  it("Case pageConfig.type = MapLayout", async () => {
    render(<PageSwitch pageConfig={{ type: "MapLayout" }} />);

    const pageContext = screen.getByTestId("mock-page-context");
    const filterProvider = screen.getByTestId("mock-filter-provider");
    const mapProvider = screen.getByTestId("mock-map-provider");
    const mapLayout = screen.getByTestId("mock-map-layout");
    expect(pageContext).toBeInTheDocument();
    expect(filterProvider).toBeInTheDocument();
    expect(mapProvider).toBeInTheDocument();
    expect(mapLayout).toBeInTheDocument();
  });
  it("Case pageConfig.type = IFrameEmbed", async () => {
    render(<PageSwitch pageConfig={{ type: "IFrameEmbed" }} />);

    const pageContext = screen.getByTestId("mock-page-context");
    const iframeembedpage = screen.getByTestId("mock-iframe-embed-page");
    expect(pageContext).toBeInTheDocument();
    expect(iframeembedpage).toBeInTheDocument();
  });

  it("FormPage places the map inline after northing by default", () => {
    render(<PageSwitch pageConfig={bngFormPageConfig} />);

    expect(screen.getByText("Housing Site Submission")).toBeInTheDocument();
    expect(screen.getByTestId("form-page-map-inline")).toBeInTheDocument();
    expect(screen.queryByTestId("form-page-map-sidebar")).not.toBeInTheDocument();

    const northing = screen.getByLabelText(/Northing/);
    const map = screen.getByTestId("form-page-map-inline");
    const siteArea = screen.getByLabelText(/Site Area/);
    expect(northing.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(map.compareDocumentPosition(siteArea) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("FormPage can keep the map in a sidebar", () => {
    render(
      <PageSwitch
        pageConfig={{
          ...bngFormPageConfig,
          config: { ...bngFormPageConfig.config, mapPreviewLayout: "sidebar" },
        }}
      />
    );

    expect(screen.getByTestId("form-page-map-sidebar")).toBeInTheDocument();
    expect(screen.queryByTestId("form-page-map-inline")).not.toBeInTheDocument();
  });
});
