import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NavBarDropdown,
  NestedDropdownPortal,
  RecursiveDropdownItem,
} from "Components/Navbar/NavBarDropdown";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { fireEvent } from "@testing-library/react";

describe("NavBarDropdown component test", () => {
  const fakeOnClick = jest.fn();
  const props = {
    item: {
      about: "<p>about</p>",
      category: "category",
      config: {},
      external: false,
      legalText: "<p>legalText</p>",
      pageName: "pageName",
      termsOfUse: "<p>termsOfUse</p>",
      type: "type",
      url: "/url",
    },
    dropdownItems: [
      {
        pageName: "pageName2",
        external: false,
      },
    ],
    activeLink: "/url",
    onClick: fakeOnClick,
    $bgColor: "#FF637E",
    onChildHoverChange: {},
  };
  it("NavBarDropdown basic render", () => {
    render(
      <MemoryRouter>
        <NavBarDropdown {...props} />
      </MemoryRouter>
    );
    const parent = screen.getByText("▾");
    expect(parent).toBeInTheDocument();
    userEvent.click(parent);
    const child = screen.getByText("pageName2");
    expect(child).toBeInTheDocument();
    child.click();
    expect(fakeOnClick).toHaveBeenCalled();
  });
});

describe("NestedDropdownPortal component test", () => {
  const fakeEnter = jest.fn();
  const fakeLeave = jest.fn();
  const props = {
    children: [
      <div key="first" data-testid="first">
        first
      </div>,
      <div key="second" data-testid="second">
        second
      </div>,
      <div key="third" data-testid="third">
        third
      </div>,
    ],
    onPortalMouseEnter: fakeEnter,
    onPortalMouseLeave: fakeLeave,
    open: true,
    parentRect: {
      bottom: 242,
      height: 42,
      left: 558.578125,
      right: 718.578125,
      top: 200,
      width: 160,
      x: 558.578125,
      y: 200,
    },
  };
  const propsWithoutOpen = {
    children: [
      <div key="first" data-testid="first">
        first
      </div>,
      <div key="second" data-testid="second">
        second
      </div>,
      <div key="third" data-testid="third">
        third
      </div>,
    ],
    onPortalMouseEnter: fakeEnter,
    onPortalMouseLeave: fakeLeave,
    open: false, // closed
    parentRect: {
      bottom: 242,
      height: 42,
      left: 558.578125,
      right: 718.578125,
      top: 200,
      width: 160,
      x: 558.578125,
      y: 200,
    },
  };
  it("Basic use of NestedDropdownPortal", () => {
    render(<NestedDropdownPortal {...props} />);
    const first = screen.getByTestId("first");
    const second = screen.getByTestId("second");
    const third = screen.getByTestId("third");
    expect(first).toBeInTheDocument();
    expect(second).toBeInTheDocument();
    expect(third).toBeInTheDocument();

    const parent = first.parentElement;
    expect(parent).toHaveStyle({
      position: "absolute",
      top: "200px",
      left: "718.578125px",
    });
  });
  it("Nothing if open or parentRect are empty", () => {
    render(<NestedDropdownPortal {...propsWithoutOpen} />);
    expect(screen.queryAllByTestId("first")).toHaveLength(0);
  });
});

describe("RecursiveDropdownItem component test", () => {
  const fakeOnClick = jest.fn();
  const fakeOnChildHoverChange = jest.fn();
  const props = {
    $bgColor: "#2c34a7ff",
    activeLink: "/url",
    item: {
      children: [
        {
          pageName: "pageName1",
          url: "/url1",
        },
      ],
      external: false,
      pageName: "pageName",
    },
    onChildHoverChange: fakeOnChildHoverChange,
    onClick: fakeOnClick,
  };
  it("Basic use of RecursiveDropdownItem", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<RecursiveDropdownItem {...props} />} />
          <Route path="/url1" element={<div>/url1</div>} />
        </Routes>
      </MemoryRouter>
    );
    const container = screen.getByTestId("dropdown-item");
    // User place mouse over the item
    expect(container).toBeInTheDocument();
    fireEvent.mouseEnter(container);
    expect(fakeOnChildHoverChange).toHaveBeenCalledWith(true);
    // Display the child item
    const child = screen.getByText("pageName1");
    expect(child).toBeInTheDocument();
    // User remove mouse from the item
    fireEvent.mouseLeave(container);
    expect(fakeOnChildHoverChange).toHaveBeenCalledWith(false);
    expect(child).not.toBeInTheDocument();

    // Parent active
    fireEvent.mouseEnter(container);
    const item = screen.getByText("pageName")
    expect(item).toBeInTheDocument();
    item.click();
    const parent = item.closest("a");
    expect(parent).toHaveStyle({ backgroundColor: "#2c34a7ff" });
    expect(parent).toHaveStyle({ color: "#f9f9f9" });
    expect(parent).toHaveAttribute('href', '/');

    // Click on child
    const p = screen.getByText("▸");
    expect(p).toBeInTheDocument();
    userEvent.click(p);
    const child1 = screen.getByText("pageName1");
    userEvent.click(child1);
    expect(screen.getByText("/url1")).toBeInTheDocument()
  });
});
