import {
  render,
  screen,
  renderHook,
  waitFor,
} from "@testing-library/react";
import { AuthProvider, useAuth } from "contexts";
import { MemoryRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { api } from "services";
import { jwtDecode } from "jwt-decode";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));
jest.mock("js-cookie");
jest.mock("jwt-decode");
jest.mock("services", () => ({
  api: {
    baseService: {
      post: jest.fn(),
    },
  },
}));

describe("AuthProvider component test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Cookies.get.mockReturnValue(null);
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <p>ImAChildren</p>
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("ImAChildren")).toBeInTheDocument();
  });

  it("provides initial context values", () => {
    const TestComponent = () => {
      const { user, token } = useAuth();
      return (
        <div>
          <div>User: {user ? user.username : "null"}</div>
          <div>Token: {token || "empty"}</div>
        </div>
      );
    };

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText("User: null")).toBeInTheDocument();
    expect(screen.getByText("Token: empty")).toBeInTheDocument();
  });

  it("initializes with token from cookie if present", () => {
    Cookies.get.mockReturnValue("existing-token");
    const TestComponent = () => {
      const { token } = useAuth();
      return <div>Token: {token}</div>;
    };

    render(
      <MemoryRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText("Token: existing-token")).toBeInTheDocument();
  });

  it("handles login successfully", async () => {
    const mockToken = "mock-jwt-token";
    const mockDecodedToken = {
      exp: Math.floor(Date.now() / 1000) + 3600,
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": [
        "admin",
        "user",
      ],
    };

    api.baseService.post.mockResolvedValue({ token: mockToken });
    jwtDecode.mockReturnValue(mockDecodedToken);

    const wrapper = ({ children }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.loginAction("testuser", "password123");

    await waitFor(() => {
      expect(result.current.user).toEqual({
        username: "testuser",
        roles: ["admin", "user"],
      });
    });

    expect(result.current.token).toBe(mockToken);
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/");
  });

  it("handles logout", () => {
    const wrapper = ({ children }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    result.current.logOut();

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBe("");
    expect(Cookies.remove).toHaveBeenCalledWith("token");
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/login");
  });

  it("handles login error", async () => {
    const mockError = new Error("Login failed");
    api.baseService.post.mockRejectedValue(mockError);

    const wrapper = ({ children }) => (
      <MemoryRouter>
        <AuthProvider>{children}</AuthProvider>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      result.current.loginAction("testuser", "wrongpassword")
    ).rejects.toThrow("Login failed");
  });
});
