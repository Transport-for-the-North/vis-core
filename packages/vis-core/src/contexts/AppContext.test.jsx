import { render, screen } from "@testing-library/react";
import { AppContextProvider, useAppContext } from "contexts";

const ConfigConsumer = () => {
  const config = useAppContext();
  return <div data-testid="config-display">{JSON.stringify(config)}</div>;
};

describe("AppContextProvider tests", () => {
  it("children props is defined", () => {
    render(
      <AppContextProvider children={<p>ImAChildren</p>} config="config" />
    );
    expect(screen.getByText("ImAChildren")).toBeInTheDocument();
  });

  it("config props is defined", () => {
    const testConfig = "testConfig";
    render(
      <AppContextProvider config={testConfig}>
        <ConfigConsumer />
        </AppContextProvider>
    );
    const configDisplay = screen.getByTestId("config-display");
    expect(configDisplay.textContent).toBe(JSON.stringify(testConfig));
  });
});
