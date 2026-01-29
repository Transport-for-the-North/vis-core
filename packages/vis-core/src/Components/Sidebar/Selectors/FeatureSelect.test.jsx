jest.mock("../../../hooks/useLayerFeatureMetadata");

import { useLayerFeatureMetadata } from "../../../hooks/useLayerFeatureMetadata";
import userEvent from "@testing-library/user-event";
import { FeatureSelect, CustomValueContainer } from "./FeatureSelect";
import { render, screen, waitFor } from "@testing-library/react";

describe("CustomValueContainer component test", () => {
  const fakeGetStyles = jest.fn();
  const fakeGetClassNames = jest.fn();
  const cx = jest.fn();
  it("Test without selectedValues.length > MAX_DISPLAY_COUNT", () => {
    const fakeFunction = jest.fn(() => ["first", "second"]);
    render(
      <CustomValueContainer
        children="ImTheChildren"
        getValue={fakeFunction}
        getStyles={fakeGetStyles}
        getClassNames={fakeGetClassNames}
        cx={cx}
      />
    );
    expect(fakeFunction).toHaveBeenCalled();
    expect(screen.getByText("ImTheChildren")).toBeInTheDocument();
  });
  it("Test with selectedValues.length > MAX_DISPLAY_COUNT", () => {
    const fakeFunction = jest.fn(() => Array(101));
    render(
      <CustomValueContainer
        children="ImTheChildren"
        getValue={fakeFunction}
        getStyles={fakeGetStyles}
        getClassNames={fakeGetClassNames}
        cx={cx}
      />
    );
    expect(screen.getByText("101 features selected")).toBeInTheDocument();
  });
});

describe("FeatureSelect component test", () => {
  const fakeOnChange = jest.fn();
  const fakeHandleInputChange = jest.fn();

  beforeEach(() => {
    useLayerFeatureMetadata.mockReturnValue({
      options: [
        { value: "first", label: "First Option" },
        { value: "second", label: "Second Option" },
      ],
      isLoading: false,
      handleInputChange: fakeHandleInputChange,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Should show placeholder when no value is selected", async () => {
    render(
      <FeatureSelect
        layerPath="/url"
        value={null} // No value to see the placeholder
        onChange={fakeOnChange}
        placeholder="placeholder"
      />
    );

    expect(screen.getByText("placeholder")).toBeInTheDocument();
  });
  it("Should display options when available", async () => {
    render(
      <FeatureSelect
        layerPath="/url"
        value={null}
        onChange={fakeOnChange}
        placeholder="Select an option"
      />
    );

    // Open the select
    const select = screen.getByRole("combobox");
    await userEvent.click(select);

    // Check that the options are displayed
    expect(screen.getByText("First Option")).toBeInTheDocument();
    expect(screen.getByText("Second Option")).toBeInTheDocument();
  });
});
