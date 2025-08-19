// Need to Mock : appName, configModule, defaultBands, apiSchema


import { render, screen } from "@testing-library/react";
import App from "../../App";
import { MemoryRouter } from "react-router-dom";

// test("renders learn react link", () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// it("should render login page when navigating to /login", async () => {
//   render(
//     <MemoryRouter initialEntries={["/login"]}>
//       <App />
//     </MemoryRouter>
//   )
//   expect(screen.getByText('Loading...')).toBeInTheDocument();

//   const loginText = await screen.findByAltText('Transport for the North');
//   expect(loginText).toBeInTheDocument();

//   expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
// });
