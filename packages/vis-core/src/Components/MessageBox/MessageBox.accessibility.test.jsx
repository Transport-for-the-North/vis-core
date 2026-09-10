import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { InfoBox, WarningBox, ErrorBox } from ".";

jest.mock("@heroicons/react/24/solid", () => ({
  ...jest.requireActual("@heroicons/react/24/solid"),
  InformationCircleIcon: () => <div>IconInfo</div>,
  XCircleIcon: () => <div>IconError</div>,
  ExclamationTriangleIcon: () => <div>IconWarning</div>,
}));

describe("MessageBox accessibility", () => {
  it("uses status role for informational messages", async () => {
    const { container } = render(<InfoBox text="Informational message" />);

    expect(screen.getByRole("status")).toHaveTextContent("Informational message");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("uses status role for warning messages", async () => {
    const { container } = render(<WarningBox text="Warning message" />);

    expect(screen.getByRole("status")).toHaveTextContent("Warning message");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("uses alert role for error messages", async () => {
    const { container } = render(<ErrorBox text="Error message" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Error message");

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
