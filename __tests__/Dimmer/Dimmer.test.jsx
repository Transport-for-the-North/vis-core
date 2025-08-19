import { Dimmer } from "Components/Dimmer";
import { render, screen } from "@testing-library/react";

describe("Dimmer loader", () => {
  it("affiche le Dimmer si showLoader est à true", () => {
    render(<Dimmer dimmed={true} showLoader={true} />);
    const element = document.querySelector(".spinner");
    expect(element).toBeInTheDocument();
  });

  it("n'affiche rien si showLoader est à false", () => {
    render(<Dimmer dimmed={true} showLoader={false} />);
    const element = document.querySelector(".spinner");
    expect(element).not.toBeInTheDocument();
  });

  it("n'affiche rien si dimmed est à false", () => {
    render(<Dimmer dimmed={false} showLoader={true} />);
    const element = document.querySelector(".spinner");
    expect(element).not.toBeInTheDocument();
  });

  it("n'affiche rien si dimmed est à false et showLoader est aussi a false", () => {
    render(<Dimmer dimmed={false} showLoader={false} />);
    const element = document.querySelector(".spinner");
    expect(element).not.toBeInTheDocument();
  });
});
