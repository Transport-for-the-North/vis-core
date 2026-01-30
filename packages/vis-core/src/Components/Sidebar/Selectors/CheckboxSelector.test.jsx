import { CheckboxSelector } from "Components/Sidebar/Selectors";
import { render, screen } from "@testing-library/react";
import { FilterContext } from "contexts";
import userEvent from "@testing-library/user-event";

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

function fake() {
  return true;
}
const filter = {
  values: {
    values: [
      { displayValue: "Apple", id: 1 },
      { displayValue: "Banana", id: 2 },
      { displayValue: "Cherry", id: 3 },
    ],
  },
};
describe("CheckboxSelector component test", () => {
  it("Basic use", () => {
    render(
      <FilterContext.Provider value={{ state: {} }}>
        <CheckboxSelector onChange={fake} bgColor="#31b231" filter={filter} />
      </FilterContext.Provider>
    );
    // label, text and input checked
    const id1 = screen.getByText("Apple");
    const id2 = screen.getByText("Banana");
    const id3 = screen.getByText("Cherry");
    const label1 = screen.getByLabelText("Apple");
    const label2 = screen.getByLabelText("Banana");
    const label3 = screen.getByLabelText("Cherry");
    const input1 = screen.getByRole("checkbox", { name: "Apple" });
    const input2 = screen.getByRole("checkbox", { name: "Banana" });
    const input3 = screen.getByRole("checkbox", { name: "Cherry" });
    expect(id1).toBeInTheDocument();
    expect(id2).toBeInTheDocument();
    expect(id3).toBeInTheDocument();
    expect(label1).toBeInTheDocument();
    expect(label2).toBeInTheDocument();
    expect(label3).toBeInTheDocument();
    expect(input1).toBeInTheDocument();
    expect(input2).toBeInTheDocument();
    expect(input3).toBeInTheDocument();
  });
  it("Change value of input without multiselect", async () => {
    render(
      <FilterContext.Provider value={{ state: {} }}>
        <CheckboxSelector onChange={fake} bgColor="#31b231" filter={filter} />
      </FilterContext.Provider>
    );
    const input1 = screen.getByRole("checkbox", { name: "Apple" });
    const input2 = screen.getByRole("checkbox", { name: "Banana" });
    const input3 = screen.getByRole("checkbox", { name: "Cherry" });
    expect(input1).toBeInTheDocument();
    expect(input2).toBeInTheDocument();
    expect(input3).toBeInTheDocument();

    // Change the value of input1 to go into the handleCheckboxChange function
    await userEvent.click(input1);
    await userEvent.click(input2);
    // Only one can be coched
    expect(input1).not.toBeChecked();
    expect(input2).toBeChecked();
    expect(input3).not.toBeChecked();
  });
  it("Change value of input with multiselect", async () => {
    const filterMultiselect = {
      ...filter,
      multiSelect: true,
    };
    render(
      <FilterContext.Provider value={{ state: {} }}>
        <CheckboxSelector
          onChange={fake}
          bgColor="#31b231"
          filter={filterMultiselect}
        />
      </FilterContext.Provider>
    );

    const input1 = screen.getByRole("checkbox", { name: "Apple" });
    const input2 = screen.getByRole("checkbox", { name: "Banana" });
    const input3 = screen.getByRole("checkbox", { name: "Cherry" });
    expect(input1).toBeInTheDocument();
    expect(input2).toBeInTheDocument();
    expect(input3).toBeInTheDocument();

    // color check
    // Change value of input1 for go in the handleCheckboxChange function
    await userEvent.click(input1);
    await userEvent.click(input2);
    // Only one can be coched
    expect(input1).toBeChecked();
    expect(input2).toBeChecked();
    expect(input3).not.toBeChecked();
  });
  it("Press the Select All button", async () => {
    const filterMultiselect = {
      ...filter,
      multiSelect: true,
    };
    render(
      <FilterContext.Provider value={{ state: {} }}>
        <CheckboxSelector
          onChange={fake}
          bgColor="#31b231"
          filter={filterMultiselect}
        />
      </FilterContext.Provider>
    );

    const selectAll = screen.getByRole("button", {name: "Select All"});
    expect(selectAll).toBeInTheDocument();

    // inputs
    const input1 = screen.getByRole("checkbox", { name: "Apple" });
    const input2 = screen.getByRole("checkbox", { name: "Banana" });
    const input3 = screen.getByRole("checkbox", { name: "Cherry" });
    expect(input1).toBeInTheDocument();
    expect(input2).toBeInTheDocument();
    expect(input3).toBeInTheDocument();

    // press the button and check the inputs
    await userEvent.click(selectAll);
    expect(input1).toBeChecked();
    expect(input2).toBeChecked();
    expect(input3).toBeChecked();
  });
});
