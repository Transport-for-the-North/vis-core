import { Glossary } from "Components/Glossary/index";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Glossary component test", () => {
  const glossaryData = {
    evcp: {
      title: "Electric Vehicle Charging Point (EVCP)",
      content: `<p>EVCP stands for electric vehicle charge points and refers to the number of charging connections (plugs) vehicles can plug into.
      In many cases, this is the same as the number of charging posts or chargers but can be different in cases where one charging post supports multiple charging plugs.</p>`,
      exclude: [],
    },
    annualChargingDemand: {
      title: "Annual Charging Demand",
      content: `<p>Gives the expected annual energy demand in kWh that vehicles are expected to require from each charging category.</p>
      <p>Note that every kWh of energy demand corresponds to roughly 6 km driven by a car, 3 km by a van, or 1 km driven by a heavy goods vehicle.</p>`,
      exclude: [],
    },
    digitallyDistributed: {
      title: "Future Travel Scenario: Digitally Distributed",
      content: `<p>This scenario sees a future where digital and technological advances accelerate, transforming how we work, travel, and live.
      In general, we embrace these technological changes and the move towards a distributed, service-based transport system.
      Long-term climate change targets are met, but there is slow progress in the short-term due to a general preference for individualized mobility over traditional public transport.
      This scenario is led by technology, with the biggest drivers being technical advances and a willingness to embrace mobility-as-a-service and shared mobility in the long-term.</p>
      <img src="/img/evci/dd-graph.png" alt="Graph plotting EV stock by year, one line per scenario" width="349" height="305" />`,
      exclude: ["mc", "tfse", "eeh", "wg", "peninsula", "te"],
    },
  };

  const renderGlossary = () => {
    render(
      <Glossary
        dataDictionary={glossaryData}
        bgColor="blue"
        fontColor="red"
        location="location"
      ></Glossary>
    );
  };

  it("Show one explanation of Glossary and touch the image", () => {
    renderGlossary();
    expect(
      screen.getByText("Get help/explanation using the search box:")
    ).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    userEvent.click(select);
    const optionSelected = screen.getByText(
      "Future Travel Scenario: Digitally Distributed"
    );
    userEvent.click(optionSelected);

    expect(
      screen.getByText(/This scenario sees a future/i)
    ).toBeInTheDocument();
  });

  it("Click on the image and open the modal then close it", () => {
    renderGlossary();

    const select = screen.getByRole("combobox");
    userEvent.click(select);
    const optionSelected = screen.getByText(
      "Future Travel Scenario: Digitally Distributed"
    );
    userEvent.click(optionSelected);

    const img = screen.getByAltText(
      "Graph plotting EV stock by year, one line per scenario"
    );
    expect(img).toBeInTheDocument();

    userEvent.click(img);
    expect(screen.getByAltText("Modal Content")).toBeInTheDocument();

    // Close the modal
    const closeButton = screen.getByText("Close");
    userEvent.click(closeButton);
    expect(screen.queryByAltText("Modal Content")).not.toBeInTheDocument();
  });
});
