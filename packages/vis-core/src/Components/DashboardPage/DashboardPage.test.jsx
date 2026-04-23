import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import DashboardPage from "./DashboardPage";
import { AppContextProvider } from "contexts";
import { PageProvider } from "contexts";
import { FilterProvider } from "contexts";
import { useFetchVisualisationData } from "hooks";

jest.mock("hooks", () => ({
  ...jest.requireActual("hooks"),
  useFetchVisualisationData: jest.fn(() => ({
    isLoading: false,
    data: [{ value: 42 }],
    error: null,
  })),
}));

const theme = {
  mq: {
    mobile: "(max-width: 768px)",
  },
  borderRadius: "8px",
};

const mockPageContext = {
  pageName: "Test Dashboard",
  about: "<p>About this dashboard</p>",
  dataPath: "/api/test-dashboard",
  config: {
    charts: [
      { type: "card", title: "Test Card", id: "card1" }
    ],
    layout: {},
    filters: [],
    formatters: {},
    barHeight: 32
  },
  legalText: "Test legal text",
  navbarLinkBgColour: "#123456"
};

const mockAppContext = {
  apiSchema: {
    paths: {
      "/api/test-dashboard": {
        get: {},
      },
    },
  },
};

describe("DashboardPage integration", () => {
  beforeEach(() => {
    useFetchVisualisationData.mockReturnValue({
      isLoading: false,
      data: [{ value: 42 }],
      error: null,
    });
  });

  it("renders chart and legal text", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider theme={theme}>
        <AppContextProvider config={mockAppContext}>
          <PageProvider config={mockPageContext}>
            <FilterProvider>
              <DashboardPage />
            </FilterProvider>
          </PageProvider>
        </AppContextProvider>
      </ThemeProvider>
    );
    expect(screen.getByText("Test Dashboard")).toBeInTheDocument();
    expect(screen.getByText("About this dashboard")).toBeInTheDocument();
    expect(await screen.findByLabelText("Test Card")).toBeInTheDocument();
    await user.click(screen.getByText("Legal"));
    expect(screen.getByText("Test legal text")).toBeInTheDocument();
  });
});
