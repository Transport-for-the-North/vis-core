import { Dimmer } from "Components/Dimmer";
import { act } from "react";
import { render, screen } from "@testing-library/react";

describe("Dimmer loader tester", () => {
  it("displays both the spinner and dimmed overlay when dimmed and showLoader are true", () => {
    render(<Dimmer dimmed={true} showLoader={true} />);
    // Check that the spinner is present
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeInTheDocument();
    // Check that the overlay is present
    const overlay = screen.getByTestId("dimmed-overlay");
    expect(overlay).toBeInTheDocument();
  });

  it("displays only the dimmed overlay when dimmed is true but showLoader is false", () => {
    render(<Dimmer dimmed={true} showLoader={false} />);
    // Check that the spinner is not present
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    // Check that the overlay is present
    const overlay = screen.getByTestId("dimmed-overlay");
    expect(overlay).toBeInTheDocument();
  });

  it("does not display anything when dimmed is false", () => {
    render(<Dimmer dimmed={false} showLoader={true} />);
    // Check that neither the spinner nor the overlay are present
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("dimmed-overlay")).not.toBeInTheDocument();
  });

  it("does not display anything when both dimmed and showLoader are false", () => {
    render(<Dimmer dimmed={false} showLoader={false} />);
    // Check that neither the spinner nor the overlay are present
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByTestId("dimmed-overlay")).not.toBeInTheDocument();
  });

  // Test to check the overlay styles
  it("renders the dimmed overlay with correct styles when displayed", () => {
    render(<Dimmer dimmed={true} showLoader={false} />);
    const overlay = screen.getByTestId("dimmed-overlay");
    expect(overlay).toHaveStyle({
      position: 'fixed',
      opacity: '0.5',
      backgroundColor: '#000',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0'
    });
  });

  it("sets progress to 100 when completeOnExit is true", () => {
    render(<Dimmer dimmed={true} showLoader={true} completeOnExit={true} />);

    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "100");
  });

  it("keeps progress non-decreasing over timer ticks", () => {
    jest.useFakeTimers();

    render(<Dimmer dimmed={true} showLoader={true} />);

    const readProgress = () => {
      const progressbar = screen.getByRole("progressbar");
      return Number(progressbar.getAttribute("aria-valuenow"));
    };

    const values = [readProgress()];

    for (let i = 0; i < 6; i += 1) {
      act(() => {
        jest.advanceTimersByTime(900);
      });
      values.push(readProgress());
    }

    for (let i = 1; i < values.length; i += 1) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]);
    }

    jest.useRealTimers();
  });
});