import { TextSection } from "Components/Sidebar";
import { render, screen } from "@testing-library/react";

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
jest.mock("Components", () => ({
  AccordionSection: ({ title, children }) => {
    return (
      <div data-testid="ImATestId">
        title: {title}
        {children}
      </div>
    );
  },
}));

describe("TextSection component test", () => {
  it("Basic component use", () => {
    render(
      <TextSection
        title="ImTheTitle"
        text="<strong>Hello world!</strong>"
      />
    );

    // title
    const titleSection = screen.getByTestId("ImATestId");
    expect(titleSection).toBeInTheDocument();
    expect(titleSection).toHaveTextContent("title: ImTheTitle");

    // text
    const text = screen.getByText("Hello world!");
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe('STRONG');
  });
});
