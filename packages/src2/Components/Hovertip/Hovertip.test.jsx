import { render, screen } from "@testing-library/react";
import { Hovertip } from "Components/Hovertip";

describe("Hovertip component test", () => {
  const buttonStyles = {
    width: "450px",
    maxWidth: "95vw",
    maxHeight: "calc(100vh - 235px)",
    padding: "10px",
    paddingRight: "6px",
    boxSizing: "border-box",
    backgroundColor: "rgba(240, 240, 240, 0.65)",
    overflowY: "scroll",
    overflowX: "hidden",
    textAlign: "left",
    position: "fixed",
    left: "10px",
    top: "85px",
    zIndex: 1000,
    borderRadius: "10px",
    transition: "left 0.3s ease-in-out",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  function button({ buttonRef }) {
    return <button ref={buttonRef} style={buttonStyles}></button>;
  }

  it("Good view of the component", () => {
    render(
      <Hovertip
        isVisible={true}
        displayText="Text to show"
        side="right"
        refElement={button}
        offset={5}
        alignVertical={true}
      />
    );
    expect(screen.getByText("Text to show")).toBeInTheDocument();
  });

  it("Don't show if isVisible isnt at true", () => {
    render(
      <Hovertip
        isVisible={false}
        displayText="Text to show"
        side="right"
        refElement={button}
        offset={5}
        alignVertical={true}
      />
    );
    expect(screen.queryByText("Text to show")).not.toBeInTheDocument();
  });

  it("Verify if the component is on the right side", () => {
    // Right side
    const refRightBtn = { current: document.createElement("button") };
    refRightBtn.current.getBoundingClientRect = jest.fn(() => ({
      bottom: 142,
      height: 32,
      left: 402,
      right: 450,
      top: 110,
      width: 48,
      x: 402,
      y: 110,
      toJSON: () => {},
    }));

    render(
      <Hovertip
        isVisible={true}
        displayText="Text to show"
        side="right"
        refElement={refRightBtn}
        offset={5}
        alignVertical={true}
      />
    );
    // screen.debug();
    expect(screen.getByText("Text to show")).toHaveStyle("left: 455px");
  });

  it("Verify if the component is on the left side", () => {
    // Left side
    const refLeftBtn = { current: document.createElement("button") };
    refLeftBtn.current.getBoundingClientRect = jest.fn(() => ({
      bottom: 142,
      height: 32,
      left: 402,
      right: 450,
      top: 110,
      width: 48,
      x: 402,
      y: 110,
      toJSON: () => {},
    }));

    render(
      <Hovertip
        isVisible={true}
        displayText="Text to show"
        side="left"
        refElement={refLeftBtn}
        offset={5}
        alignVertical={true}
      />
    );
    // screen.debug();
    expect(screen.getByText("Text to show")).toHaveStyle("left: 397px");
  });

  it("aligns the hovertip vertically if alignVertical={true}", () => {
    // Fixed values
    const rect = {
      bottom: 142,
      height: 32,
      left: 402,
      right: 450,
      top: 110,
      width: 48,
      x: 402,
      y: 110,
      toJSON: () => {},
    };
    const hovertipHeight = 20;

    // Mock ref button
    const refLeftBtn = { current: document.createElement("button") };
    refLeftBtn.current.getBoundingClientRect = jest.fn(() => rect);

    // Mock hovertip size
    const oldCreateElement = document.createElement;
    document.createElement = (tag) => {
      const el = oldCreateElement.call(document, tag);
      if (tag === "div") {
        el.getBoundingClientRect = () => ({
          width: 100,
          height: hovertipHeight,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        });
      }
      return el;
    };

    render(
      <Hovertip
        isVisible={true}
        displayText="Text to show"
        side="left"
        refElement={refLeftBtn}
        offset={5}
        alignVertical={true}
      />
    );

    // Calculates the expected value for .style.top
    const expectedTop = rect.top + rect.height / 2 - hovertipHeight / 2; // 110 + 16 - 10 = 116
    expect(screen.getByText("Text to show")).toHaveStyle(
      `top: ${expectedTop}px`
    );
    // Restore the mock
    document.createElement = oldCreateElement;
  });

  it("Offset right", () => {
    // Fixed values
    const rect = {
      bottom: 142,
      height: 32,
      left: 402,
      right: 450,
      top: 110,
      width: 48,
      x: 402,
      y: 110,
      toJSON: () => {},
    };
    const hovertipWidth = 100;

    // Mock ref button
    const refLeftBtn = { current: document.createElement("button") };
    refLeftBtn.current.getBoundingClientRect = jest.fn(() => rect);
    // Mock hovertip size
    const oldCreateElement = document.createElement;
    document.createElement = (tag) => {
      const el = oldCreateElement.call(document, tag);
      if (tag === "div") {
        el.getBoundingClientRect = () => ({
          width: hovertipWidth,
          height: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          x: 0,
          y: 0,
          toJSON: () => {},
        });
      }
      return el;
    };

    render(
      <Hovertip
        isVisible={true}
        displayText="Text to show"
        side="left"
        refElement={refLeftBtn}
        offset={50}
        alignVertical={true}
      />
    );

    const expectedLeft = rect.left - 50 - hovertipWidth;
    expect(screen.getByText("Text to show")).toHaveStyle(
      `left: ${expectedLeft}px`
    );
  });
});