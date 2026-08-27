import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { Login } from "Components/Login";
import { useAuth } from "contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

jest.mock("contexts/AuthProvider");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login accessibility", () => {
  const renderLogin = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

  beforeEach(() => {
    useNavigate.mockReturnValue(jest.fn());
    useAuth.mockReturnValue({
      loginAction: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with no automated accessibility violations", async () => {
    const { container } = renderLogin();

    expect(screen.getByRole("heading", { name: /welcome/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/user name\*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password\*/i)).toBeInTheDocument();

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("announces login errors through an alert region", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const failingLogin = jest.fn().mockRejectedValue(new Error("Login failed"));
    useAuth.mockReturnValue({ loginAction: failingLogin });

    renderLogin();

    await userEvent.type(screen.getByLabelText(/user name\*/i), "user");
    await userEvent.type(screen.getByLabelText(/password\*/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid username or password");
    });

    consoleSpy.mockRestore();
  });
});
