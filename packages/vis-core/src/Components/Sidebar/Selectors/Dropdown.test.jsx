import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "Components/Sidebar/Selectors/Dropdown";
import { FilterContext } from "contexts";

jest.mock("styled-components", () => {
  const actual = jest.requireActual("styled-components");
  const styled = actual.default ?? actual;
  return {
    __esModule: true,
    ...actual,
    default: styled,
    useTheme: () => ({
      borderRadius: "4px",
      activeBg: "#6b46c1",
    }),
  };
});

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
const createMockFilterContext = (initialState = {}) => ({
  state: initialState,
  dispatch: jest.fn(),
});

const fakeFunction = jest.fn();
const props = {
  filter: {
    values: {
      values: [
        {
          displayValue: "displayValue",
          paramValue: "paramValue",
          isValid: "isValid",
          isHidden: false,
        },
      ],
      shouldBeBlankOnInit: "shouldBeBlankOnInit",
    },
    id: "id",
  },
};

describe("Dropdown component test", () => {
  let mockFilterContext = createMockFilterContext();
  it("Click on the select", async () => {
    render(
      <FilterContext.Provider value={mockFilterContext}>
        <Dropdown {...props} onChange={fakeFunction} />
      </FilterContext.Provider>
    );
    // Select
    const select = screen.getByRole("combobox");
    userEvent.click(select);
    await waitFor(async () => {
      const options = screen.getAllByRole("option");
      options.forEach((option, index) => {});
      await userEvent.click(options[0]);
    });
    expect(screen.getByText(/displayValue/)).toBeInTheDocument();
    // Not multiselect
    expect(screen.queryByText("All")).not.toBeInTheDocument();
  });
  it("Test the component with a multiselect and click on the All button", async () => {
    const propsMultiselect = {
      filter: {
        ...props.filter,
        id: "testFilter",
        multiSelect: true,
        values: {
          values: [
            {
              paramValue: "first",
              displayValue: "First Option",
              isHidden: false,
            },
            {
              paramValue: "second",
              displayValue: "Second Option",
              isHidden: false,
            },
            {
              paramValue: "third",
              displayValue: "Third Option",
              isHidden: false,
            },
          ],
        },
      },
    };

    // Initial state with some options selected
    const filterState = { testFilter: ["first"] };
    mockFilterContext = createMockFilterContext(filterState);

    render(
      <FilterContext.Provider value={mockFilterContext}>
        <Dropdown {...propsMultiselect} onChange={fakeFunction} />
      </FilterContext.Provider>
    );

    // Open the select
    const select = screen.getByRole("combobox");
    await userEvent.click(select);

    // Try to find the 'All' option in different ways.
    let allOption;
    try {
      allOption = screen.getByRole("option", { name: "All" });
    } catch (e) {
      console.log("Can't find 'All' by role");
      allOption = screen.getByText("All");
    }

    await userEvent.click(allOption);

    // Check that onChange has been called
    await waitFor(() => {
      expect(fakeFunction).toHaveBeenCalled();
    });
  });
});
