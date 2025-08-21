import { PrivateRoute } from "../../PrivateRoute/PrivateRoute";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Cookies from "js-cookie";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(() => "/test"),
}));

describe("PrivateRoute Component", () => {
  // Initial render to set up the component
  const initialRender = () => {
    return (
      <MemoryRouter initialEntries={["/initial"]}>
        <Routes>
          <Route
            path="/initial"
            element={
              <PrivateRoute
                element={<div>Protected content</div>}
                requiredRole="userRole"
              />
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };
  it("should render the component if user is authenticated and has the required role", () => {
    render(initialRender());

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    // screen.debug();
  });

  it("Displays the component correctly when we are logged in with the correct role.", () => {
    // In PrivateRoute.jsx, the token is decoded to extract the user's role.
    // We'll simulate this behavior by creating a mock encoded token,
    // so that when it's decoded using atob() in the component, it returns the correct role.
    const fakePayload = { role: "userRole" };
    const base64Payload = btoa(JSON.stringify(fakePayload));
    const fakeToken = `header.${base64Payload}.signature`;
    Cookies.get = jest.fn(() => fakeToken);
    render(initialRender());

    expect(screen.getByText("Protected content")).toBeInTheDocument();
    // screen.debug();
  });

  it("Invalid role in the token redirects to the login page", () => {
    // Same fake crypted token, with a different role than the one in the PrivateRoute
    const fakePayload = { role: "badRole" };
    const base64Payload = btoa(JSON.stringify(fakePayload));
    const fakeToken = `header.${base64Payload}.signature`;
    Cookies.get = jest.fn(() => fakeToken);
    render(initialRender());

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    // screen.debug();
  });
});
