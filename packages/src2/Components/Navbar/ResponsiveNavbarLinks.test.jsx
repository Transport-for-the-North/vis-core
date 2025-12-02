import { ResponsiveNavbarLinks } from "Components/Navbar/ResponsiveNavbarLinks";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import userEvent from "@testing-library/user-event";

describe("ResponsiveNavbarLinks component test", () => {
  const fakeOnCLick = jest.fn();
  const props = {
    $bgColor: "#7317de",
    activeLink: "/",
    links: [
      { label: "Home", url: "/", navbarLinkBgColour: "#7317de" },
      { label: "Second", url: "/second", navbarLinkBgColour: undefined },
      {
        label: "Third",
        navbarLinkBgColour: undefined,
        dropdownItems: [{ pageName: "Third1", url: "/third1" }],
      },
      {
        label: "External",
        url: "/external",
        external: true,
        navbarLinkBgColour: undefined,
      },
    ],
    onClick: fakeOnCLick,
  };
  const renderElement = (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<ResponsiveNavbarLinks {...props} />} />
        <Route path="/second" element={<div>SecondPage</div>} />
        <Route path="/third1" element={<div>Third1</div>} />
        <Route path="/external" element={<div>ExternalPage</div>} />
      </Routes>
    </MemoryRouter>
  );
  it("Basic use of ResponsiveNavbarLinks with a child element", async () => {
    render(renderElement);

    // Click on child link
    const third = screen.getByText("Third");
    expect(third).toBeInTheDocument();
    userEvent.click(third);
    await waitFor(() => {
      expect(screen.getByText("Third1")).toBeInTheDocument();
    })
    const childThird = screen.getByText("Third1");
    userEvent.click(childThird);
    expect(fakeOnCLick).toHaveBeenCalled();
    expect(screen.getByText("Third1")).toBeInTheDocument();
  });
  it("Basic use of ResponsiveNavbarLinks with external", () => {
    render(renderElement);

    // Click on child link
    const external = screen.getByText("External");
    expect(external).toBeInTheDocument();
    const link = external.closest("a");
    expect(link).toHaveAttribute("href", "/external");
  });
  it("Basic use of ResponsiveNavbarLinks without external and dropdownItems", async () => {
    render(renderElement);

    // Click on child link
    const second = screen.getByText("Second");
    expect(second).toBeInTheDocument();
    userEvent.click(second);
    expect(fakeOnCLick).toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText("SecondPage")).toBeInTheDocument();
    })
  });
});
