import { InfoBox, WarningBox, ErrorBox } from ".";
import { render, screen } from "@testing-library/react";

jest.mock("@heroicons/react/24/solid",()  => ({
    ...jest.requireActual("@heroicons/react/24/solid"),
    InformationCircleIcon: () => <div>IconInfo</div>,
    XCircleIcon: () => <div>IconError</div>,
    ExclamationTriangleIcon: () => <div>IconWarning</div>,
}));

describe("MessageBox test component", () => {
  it("Type warning", () => {
    render(<WarningBox text="This is a warning message" />);
    const el = screen.getByText("This is a warning message");
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle("background-color: rgba(255, 255, 153, 0.9);");
    expect(el).toHaveStyle("color: rgb(102, 60, 0);");
    expect(screen.getByText("IconWarning")).toBeInTheDocument();
  });
  it("Type error", () => {
    render(<ErrorBox text="This is an error message" />);
    const el = screen.getByText("This is an error message");
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle("background-color: #ffebee;");
    expect(el).toHaveStyle("color: #d32f2f;");
    expect(screen.getByText("IconError")).toBeInTheDocument();
  });
  it("Type info", () => {
    render(<InfoBox text="This is an info message" />);
    const el = screen.getByText("This is an info message");
    expect(el).toBeInTheDocument();
    expect(el).toHaveStyle("background-color: rgba(0, 222, 198, 0.9);");
    expect(el).toHaveStyle("color: rgb(13, 15, 61);");
    expect(screen.getByText("IconInfo")).toBeInTheDocument();
  });
});
