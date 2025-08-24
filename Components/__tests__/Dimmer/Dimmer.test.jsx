import { Dimmer } from "Components/Dimmer";
import { render, screen } from "@testing-library/react";

describe("Dimmer loader tester", () => {
  it("displays the Dimmer if showLoader is set to true", () => {
    render(<Dimmer dimmed={true} showLoader={true} />);
    const element = screen.getByRole("status");
    expect(element).toBeInTheDocument();
  });

  it("does not display anything if showLoader is set to false", () => {
    render(<Dimmer dimmed={true} showLoader={false} />);
    const element = screen.getByRole("status");
    expect(element).not.toBeInTheDocument();
  });

  it("does not display anything if dimmed is false", () => {
    render(<Dimmer dimmed={false} showLoader={true} />);
    const element = screen.getByRole("status");
    expect(element).not.toBeInTheDocument();
  });

  it("does not display anything if dimmed is false and showLoader is also false", () => {
    render(<Dimmer dimmed={false} showLoader={false} />);
    const element = screen.getByRole("status");
    expect(element).not.toBeInTheDocument();
  });
});
