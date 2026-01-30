import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClassificationDropdown } from "Components/Sidebar/Selectors/ClassificationDropdown";

jest.mock("maplibre-gl", () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    remove: jest.fn(),
    addLayer: jest.fn(),
    setStyle: jest.fn(),
    flyTo: jest.fn(),
  })),
}));

function fakeOnChange() {
  return true;
}

jest.mock("Components/Sidebar/Selectors/SelectorLabel", () => ({
  SelectorLabel: ({ text, info }) => (
    <>
      <div>text: {text}</div>
      <div>info: {info}</div>
    </>
  ),
}));

describe("ClassificationDropdown component test", () => {
  it("Basic use test", () => {
    render(
      <ClassificationDropdown
        classType={["class"]}
        onChange={fakeOnChange}
        classification={{ value: "value" }}
      />
    );
    // Show SelectorLabel component
    expect(screen.getByText("text: Classification method")).toBeInTheDocument();
    expect(
      screen.getByText("info: Select classification method for map data")
    ).toBeInTheDocument();

    // verify that the select is present
    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });
  it("Change value of the select", async () => {
    const mockOnChange = jest.fn();
    render(
      <ClassificationDropdown
        classType={["class"]}
        onChange={mockOnChange}
        classification={{ value: "value" }}
      />
    );
    // Interact with the Select
    const select = screen.getByRole("combobox");
    userEvent.click(select);

    // Wait and click on the option in the same waitFor
    await waitFor(async () => {
      const menuList = screen.getByRole("listbox");
      const { getByText } = within(menuList);
      const optionToSelect = getByText("0");
      await userEvent.click(optionToSelect);
    });

    // Check the call
    expect(mockOnChange).toHaveBeenCalledWith("class");
  });
});
