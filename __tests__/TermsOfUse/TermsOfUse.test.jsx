import { TermsOfUse } from "Components/TermsOfUse";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("TermsOfUse unit test", () => {
  it("Show the text in props", () => {
    render(<TermsOfUse htmlText="<p>Bienvenue</p>" />);
    expect(screen.getByText("Bienvenue")).toBeInTheDocument();
    expect(screen.getByText("Accept")).toBeInTheDocument();
  });
  it("Not at all, when you accept the terms", () => {
    render(<TermsOfUse htmlText="<p>Bienvenue</p>" />);
    userEvent.click(screen.getByText("Accept"));
    expect(screen.queryByText("Bienvenue")).not.toBeInTheDocument();
    expect(screen.queryByText("Accept")).not.toBeInTheDocument();
    expect(screen.queryByText("Terms of Use")).not.toBeInTheDocument();
  });
});
