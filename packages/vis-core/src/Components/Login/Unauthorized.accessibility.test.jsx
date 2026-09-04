import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { axe } from "jest-axe";
import { Unauthorized } from "Components/Login";

describe("Unauthorized accessibility", () => {
  it("renders with landmark structure and no automated accessibility violations", async () => {
    const { container } = render(
      <BrowserRouter>
        <Unauthorized />
      </BrowserRouter>,
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /unauthorised/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /return to login/i })).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
