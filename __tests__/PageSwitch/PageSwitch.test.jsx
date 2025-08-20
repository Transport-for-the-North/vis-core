import { render, screen, waitFor } from "@testing-library/react";
import { PageSwitch } from "../../PageSwitch/PageSwitch";

// Mocks
jest.mock("Components", () => ({
  MapLayout: () => <div data-testid="mock-map-layout" />,
  IFrameEmbedPage: () => <div data-testid="mock-iframe-embed-page" />,
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
    // screen.debug();

    const pageContext = screen.getByTestId("mock-page-context");
    const filterProvider = screen.getByTestId("mock-filter-provider");
    const mapProvider = screen.getByTestId("mock-map-provider");
    const mapLayout = screen.getByTestId("mock-map-layout");
    // const iframeembedpage = screen.getByTestId("mock-iframe-embed-page");
    expect(pageContext).toBeInTheDocument();
    expect(filterProvider).toBeInTheDocument();
    expect(mapProvider).toBeInTheDocument();
    expect(mapLayout).toBeInTheDocument();
  });
  it("Case pageConfig.type = MapLayout", async () => {
    render(<PageSwitch pageConfig={{ type: "MapLayout" }} />);
    // screen.debug();

    const pageContext = screen.getByTestId("mock-page-context");
    const filterProvider = screen.getByTestId("mock-filter-provider");
    const mapProvider = screen.getByTestId("mock-map-provider");
    const mapLayout = screen.getByTestId("mock-map-layout");
    // const iframeembedpage = screen.getByTestId("mock-iframe-embed-page");
    expect(pageContext).toBeInTheDocument();
    expect(filterProvider).toBeInTheDocument();
    expect(mapProvider).toBeInTheDocument();
    expect(mapLayout).toBeInTheDocument();
  });
  it("Case pageConfig.type = IFrameEmbed", async () => {
    render(<PageSwitch pageConfig={{ type: "IFrameEmbed" }} />);
    // screen.debug();

    const pageContext = screen.getByTestId("mock-page-context");
    // const filterProvider = screen.getByTestId("mock-filter-provider");
    // const mapProvider = screen.getByTestId("mock-map-provider");
    // const mapLayout = screen.getByTestId("mock-map-layout");
    const iframeembedpage = screen.getByTestId("mock-iframe-embed-page");
    expect(pageContext).toBeInTheDocument();
    expect(iframeembedpage).toBeInTheDocument();
  });
});
