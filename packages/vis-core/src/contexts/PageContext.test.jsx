import { render, screen } from "@testing-library/react";
import { PageProvider, usePage } from "contexts";

const ConfigConsumer = () => {
  const config = usePage();
  return <div data-testid="config-display">{JSON.stringify(config)}</div>;
};

describe("PageProvider component test", () => {
  it("children props is defined", () => {
    render(<PageProvider children={<p>ImAChildren</p>} config="config" />);
    expect(screen.getByText("ImAChildren")).toBeInTheDocument();
  });

  it("config props is defined", () => {
    render(
      <PageProvider config="config">
        <ConfigConsumer />
      </PageProvider>
    );
    expect(screen.getByTestId("config-display")).toBeInTheDocument();
    expect(screen.getByTestId("config-display").textContent).toBe("\"config\"");
  });
});
