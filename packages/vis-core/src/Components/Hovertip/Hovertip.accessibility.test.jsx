import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Hovertip } from "Components/Hovertip";

describe("Hovertip accessibility", () => {
  it("renders a tooltip role and has no automated accessibility violations", async () => {
    const refElement = { current: document.createElement("button") };
    refElement.current.getBoundingClientRect = jest.fn(() => ({
      top: 100,
      left: 200,
      right: 240,
      bottom: 130,
      width: 40,
      height: 30,
      x: 200,
      y: 100,
      toJSON: () => {},
    }));

    const { container } = render(
      <Hovertip
        isVisible={true}
        displayText="Helpful context"
        side="right"
        refElement={refElement}
        offset={8}
        tooltipId="tooltip-help"
      />,
    );

    expect(screen.getByRole("tooltip")).toHaveTextContent("Helpful context");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
