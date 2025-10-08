import { NotFound } from ".";
import { render, screen, act } from "@testing-library/react";
import { AppContext } from "../../contexts/AppContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

// Mock timers
jest.useFakeTimers();

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock of the styled-components theme
const mockTheme = {
  colors: {
    primary: "#7317de",
    textPrimary: "#111",
    textSecondary: "#666",
    border: "#ddd",
  },
  logo: "theme-logo.png",
  branding: { logo: "theme-branding-logo.png" },
};

// Helper for rendering with all necessary providers
const renderWithProviders = (component, { appContextValue = {}, theme = mockTheme } = {}) => {
  return render(
    <BrowserRouter>
      <AppContext.Provider value={appContextValue}>
        <ThemeProvider theme={theme}>
          {component}
        </ThemeProvider>
      </AppContext.Provider>
    </BrowserRouter>
  );
};

describe("NotFound component test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Clean the timers after each test.
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should display 404 error message when page doesn't exist", () => {
    const mockAppContext = {
      logo: "mock-logo.png",
      branding: { logo: "branding-logo.png" },
      basename: "/",
    };

    renderWithProviders(<NotFound />, { appContextValue: mockAppContext });

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
  });

  it("should display countdown message initially", () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByText(/You will be redirected home in 10 seconds/)).toBeInTheDocument();
  });

  it("should update countdown every second", async () => {
    renderWithProviders(<NotFound />);

    expect(screen.getByText(/You will be redirected home in 10 seconds/)).toBeInTheDocument();

    // Advance the timer by 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/You will be redirected home in 9 seconds/)).toBeInTheDocument();

    // Advance another 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText(/You will be redirected home in 8 seconds/)).toBeInTheDocument();
  });

  it("should show redirecting message and navigate after countdown", async () => {
    renderWithProviders(<NotFound />);

    // Advance 10 seconds to trigger redirection
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(screen.getByText("Redirecting...")).toBeInTheDocument();

    // Advance by an additional 1 second to trigger navigation
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("should display logo when provided in app context", () => {
    const mockAppContext = {
      logo: "mock-logo.png",
    };

    renderWithProviders(<NotFound />, { appContextValue: mockAppContext });

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "mock-logo.png");
  });

  it("should prioritize app context logo over theme logo", () => {
    const mockAppContext = {
      logo: "app-logo.png",
    };

    const themeWithLogo = {
      ...mockTheme,
      logo: "theme-logo.png",
    };

    renderWithProviders(<NotFound />, { 
      appContextValue: mockAppContext, 
      theme: themeWithLogo 
    });

    const logo = screen.getByAltText("Logo");
    expect(logo).toHaveAttribute("src", "app-logo.png");
  });

  it("should have accessible navigation buttons", () => {
    renderWithProviders(<NotFound />);

    const homeLink = screen.getByRole("link", { name: "Go to Home" });
    const backButton = screen.getByRole("button", { name: "Go Back" });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(backButton).toBeInTheDocument();
  });

  it("should have proper ARIA attributes for screen readers", () => {
    renderWithProviders(<NotFound />);

    const statusMessage = screen.getByRole("status");
    expect(statusMessage).toHaveAttribute("aria-live", "polite");
  });
});