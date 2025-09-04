import { Dimmer } from "Components/Dimmer";
import { render, screen } from "@testing-library/react";

describe("Dimmer loader tester", () => {
  it("displays the Dimmer if showLoader is set to true", () => {
    render(<Dimmer dimmed={true} showLoader={true} />);
    const element = screen.queryByRole("progressbar");
    expect(element).toBeInTheDocument();
  });

  it("does not display anything if showLoader is set to false", () => {
    render(<Dimmer dimmed={true} showLoader={false} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("does not display anything if dimmed is false", () => {
    render(<Dimmer dimmed={false} showLoader={true} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("does not display anything if dimmed is false and showLoader is also false", () => {
    render(<Dimmer dimmed={false} showLoader={false} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
