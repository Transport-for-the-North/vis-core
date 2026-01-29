import { render, screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { AccordionSection } from "Components/Sidebar";

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

describe("AccordionSection", () => {
  it("displays the title and hides the content by default", () => {
    render(
      <AccordionSection title="MyTitle" defaultValue={false}>
        <div>Hidden content</div>
      </AccordionSection>
    );

    expect(screen.getByText("MyTitle")).toBeInTheDocument();
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });

  it("displays the content if defaultValue is true", () => {
    render(
      <AccordionSection title="TitleOpen" defaultValue={true}>
        <div>Visible content</div>
      </AccordionSection>
    );

    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("displays the content after clicking on the header", () => {
    render(
      <AccordionSection title="Clickable" defaultValue={false}>
        <div>Dynamic content</div>
      </AccordionSection>
    );

    const header = screen.getByText("Clickable");
    fireEvent.click(header);

    expect(screen.getByText("Dynamic content")).toBeInTheDocument();
  });

  it("hides content after two clicks", () => {
    render(
      <AccordionSection title="Toggle" defaultValue={false}>
        <div>Content toggle</div>
      </AccordionSection>
    );

    const header = screen.getByText("Toggle");
    fireEvent.click(header); // open
    expect(screen.getByText("Content toggle")).toBeInTheDocument();

    fireEvent.click(header); // close
    expect(screen.queryByText("Content toggle")).not.toBeInTheDocument();
  });
});