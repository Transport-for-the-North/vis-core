import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Login } from "Components/Login";
import { useAuth } from "contexts/AuthProvider";
import { AppContext } from "contexts/AppContext";
import { useNavigate } from "react-router-dom";

// The TfN defaults. Apps that set no login keys must keep seeing exactly these.
const DEFAULT_LOGIN_LOGO_IMAGE = "/img/tfn-logo-fullsize.png";
const DEFAULT_LOGIN_LOGO_ALT = "Transport for the North";
const DEFAULT_LOGIN_TEXT =
  "Log in to Transport for the North to continue to the Appraisal Platform.";
import userEvent from "@testing-library/user-event";
import { Unauthorized } from "Components/Login";

// Here we define which functions will be mocked.
jest.mock("contexts/AuthProvider"); // Everything in AuthProvider
jest.mock("react-router-dom", () => ({
  // Only the useNavigate function of the ‘react-router-dom’ module
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("Login component test", () => {
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  // Success
  it("Successful login with valid credentials", async () => {
    // Mocks
    const mockLoginAction = jest.fn().mockResolvedValue();
    const mockNavigate = jest.fn();

    useAuth.mockReturnValue({ loginAction: mockLoginAction });
    useNavigate.mockReturnValue(mockNavigate);

    renderLogin();

    // Selection of different elements
    const inputUsername = screen.getByLabelText(/User Name*/i);
    const inputPassword = screen.getByLabelText(/Password*/i);
    const submitButton = screen.getByRole("button", { name: /Continue/i });

    // Check that the items are present
    expect(inputUsername).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

    // Enter data into the input fields
    await userEvent.type(inputUsername, "testuser");
    await userEvent.type(inputPassword, "testpassword");

    // Submit the form
    await userEvent.click(submitButton);

    // Check that loginAction has been called with the correct data.
    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith("testuser", "testpassword");
    });

    // Check that no errors are displayed.
    expect(
      screen.queryByText("Invalid username or password")
    ).not.toBeInTheDocument();
  });

  // Fail
  it("Wrong login, error message", async () => {
    // Mocks
    const mockLoginActionFailed = jest
      .fn()
      .mockRejectedValue(new Error("Login Failed"));
    const mockNavigate = jest.fn();

    useAuth.mockReturnValue({ loginAction: mockLoginActionFailed });
    useNavigate.mockReturnValue(mockNavigate);

    renderLogin();

    const inputUsername = screen.getByLabelText(/User Name*/i);
    const inputPassword = screen.getByLabelText(/Password*/i);
    const submitButton = screen.getByRole("button", { name: /Continue/i });

    await userEvent.type(inputUsername, "falseuser");
    await userEvent.type(inputPassword, "falsepassword");

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLoginActionFailed).toHaveBeenCalledWith(
        "falseuser",
        "falsepassword"
      );
      /* When the form is submitted, we expect to see a paragraph in the DOM: ‘Invalid username or password’.
         Given that it is the mock that will fail that is called  */
      expect(
        screen.getByText("Invalid username or password")
      ).toBeInTheDocument();
    });
  });

  it("shows the default TfN logo and text when the app config sets none", () => {
    useAuth.mockReturnValue({ loginAction: jest.fn() });

    renderLogin();

    const logo = screen.getByRole("img", { name: DEFAULT_LOGIN_LOGO_ALT });
    expect(logo).toHaveAttribute("src", DEFAULT_LOGIN_LOGO_IMAGE);
    expect(screen.getByText(DEFAULT_LOGIN_TEXT)).toBeInTheDocument();
  });

  it("uses the logo and text from the app config when provided", () => {
    useAuth.mockReturnValue({ loginAction: jest.fn() });

    render(
      <AppContext.Provider
        value={{
          loginLogoImage: "/img/custom-logo.png",
          loginLogoAlt: "Custom Authority",
          loginText: "Log in to Custom Authority to continue.",
        }}
      >
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AppContext.Provider>
    );

    const logo = screen.getByRole("img", { name: "Custom Authority" });
    expect(logo).toHaveAttribute("src", "/img/custom-logo.png");
    expect(
      screen.getByText("Log in to Custom Authority to continue.")
    ).toBeInTheDocument();
    expect(screen.queryByText(DEFAULT_LOGIN_TEXT)).not.toBeInTheDocument();
  });

  it("falls back to the defaults for any login key the app config leaves out", () => {
    useAuth.mockReturnValue({ loginAction: jest.fn() });

    render(
      <AppContext.Provider value={{ loginText: "Only the text is custom." }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AppContext.Provider>
    );

    const logo = screen.getByRole("img", { name: DEFAULT_LOGIN_LOGO_ALT });
    expect(logo).toHaveAttribute("src", DEFAULT_LOGIN_LOGO_IMAGE);
    expect(screen.getByText("Only the text is custom.")).toBeInTheDocument();
  });
});
describe("Unauthorized component test", () => {
  it("All items are displayed", () => {
    render(
      <BrowserRouter>
        <Unauthorized />
      </BrowserRouter>
    );
    expect(screen.getByText("Unauthorised")).toBeInTheDocument();
    expect(
      screen.getByText(/You are not authorised to access this app./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Return to login/i)
    ).toBeInTheDocument();
  });
});
