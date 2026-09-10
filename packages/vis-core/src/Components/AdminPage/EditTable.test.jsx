import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "styled-components";
import { EditTable } from "./EditTable";
import { AdminApiContext, AdminCanEditContext, AdminRefreshContext } from "hooks";

const theme = { borderRadius: "4px", activeBg: "#7317de", primaryColor: "#0d0f3d" };

// Mirrors the NoRMS scenario registrations editor: app_id is fixed to the current app,
// registration_id is DB-generated, and scenario_id is a multi-select lookup.
const columns = [
  { name: "registration_id", dataType: "integer", isGenerated: true, isPrimaryKey: true, isNullable: false },
  { name: "app_id", dataType: "integer", isGenerated: false, isPrimaryKey: false, isNullable: false },
  { name: "scenario_id", dataType: "integer", isGenerated: false, isPrimaryKey: false, isNullable: false },
];

const scenarioOptions = [
  { value: 1, label: "IGX_2018" },
  { value: 2, label: "JPI_2042" },
  { value: 3, label: "JRT_2042" },
];

const table = {
  tableName: "scenario_app_registrations",
  schema: "rail_data",
  displayName: "Scenario Registrations",
  fixedValues: { app_id: 7 },
  lookups: {
    scenario_id: {
      table: "input_norms_scenario",
      schema: "rail_data",
      valueColumn: "id",
      labelColumn: "scenario_code",
      addToTable: true,
      multiSelect: true,
      placeholder: "Select scenarios",
    },
  },
  auditWrite: {
    table: "pipeline_audit_log",
    schema: "rail_data",
    onAdd: { action_type: "REGISTERED", scenario_id: { from: "scenario_id" } },
  },
};

/**
 * Builds a mock admin API returning no existing rows and the scenario options above.
 * @param {Object} [overrides] - Method overrides (e.g. a failing addRow).
 * @returns {Object} The mock admin API.
 */
const createAdminApi = (overrides = {}) => ({
  getRows: jest.fn().mockResolvedValue([]),
  getColumns: jest.fn().mockResolvedValue(columns),
  getLookup: jest.fn().mockResolvedValue(scenarioOptions),
  addRow: jest.fn().mockResolvedValue({}),
  deleteRow: jest.fn().mockResolvedValue({}),
  ...overrides,
});

/**
 * Renders the edit table wired to a mock admin API and the contexts it depends on.
 * @param {Object} adminApi - The mock admin API.
 * @returns {{requestRefresh: Function}} Handles for asserting on side effects.
 */
const renderEditTable = (adminApi) => {
  const requestRefresh = jest.fn();
  render(
    <ThemeProvider theme={theme}>
      <AdminApiContext.Provider value={adminApi}>
        <AdminCanEditContext.Provider value={true}>
          <AdminRefreshContext.Provider value={{ signals: {}, requestRefresh }}>
            <EditTable table={table} />
          </AdminRefreshContext.Provider>
        </AdminCanEditContext.Provider>
      </AdminApiContext.Provider>
    </ThemeProvider>
  );
  return { requestRefresh };
};

/**
 * Picks the named options in the multi-select scenario dropdown.
 * @param {Array<string>} labels - Option labels to select, in order.
 * @returns {Promise<void>}
 */
const selectScenarios = async (labels) => {
  for (const label of labels) {
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByText(label));
  }
};

describe("EditTable multi-select add", () => {
  it("adds one row per selected value in a single Add press", async () => {
    const adminApi = createAdminApi();
    const { requestRefresh } = renderEditTable(adminApi);
    await screen.findByRole("button", { name: "Add" });

    await selectScenarios(["IGX_2018", "JRT_2042"]);

    // The button names the count once more than one row would be inserted.
    const addButton = screen.getByRole("button", { name: "Add 2" });
    await userEvent.click(addButton);

    await waitFor(() => expect(adminApi.addRow).toHaveBeenCalledTimes(2));
    expect(adminApi.addRow.mock.calls.map(([arg]) => arg.values)).toEqual([
      { app_id: 7, scenario_id: 1 },
      { app_id: 7, scenario_id: 3 },
    ]);
    // Each insert carries its own audit-log entry, resolved from that row's values.
    expect(adminApi.addRow.mock.calls.map(([arg]) => arg.alsoInsert.values.scenario_id)).toEqual([1, 3]);
    expect(await screen.findByText("Added 2 rows.")).toBeInTheDocument();
    expect(requestRefresh).toHaveBeenCalled();
  });

  it("adds a single row when one value is selected", async () => {
    const adminApi = createAdminApi();
    renderEditTable(adminApi);
    await screen.findByRole("button", { name: "Add" });

    await selectScenarios(["JPI_2042"]);
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(adminApi.addRow).toHaveBeenCalledTimes(1));
    expect(adminApi.addRow.mock.calls[0][0].values).toEqual({ app_id: 7, scenario_id: 2 });
    expect(await screen.findByText("Added 1 row.")).toBeInTheDocument();
  });

  it("keeps Add disabled until a required value is selected", async () => {
    renderEditTable(createAdminApi());
    expect(await screen.findByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("reports a partial failure and keeps the rows that succeeded", async () => {
    const addRow = jest
      .fn()
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error("duplicate"));
    const adminApi = createAdminApi({ addRow });
    renderEditTable(adminApi);
    await screen.findByRole("button", { name: "Add" });

    await selectScenarios(["IGX_2018", "JPI_2042"]);
    await userEvent.click(screen.getByRole("button", { name: "Add 2" }));

    expect(await screen.findByText("Added 1 of 2 rows — 1 failed.")).toBeInTheDocument();
  });
});

describe("EditTable refresh", () => {
  it("keeps the table on screen while reloading after an add", async () => {
    const adminApi = createAdminApi();
    // The reload that follows the add returns the newly registered row.
    adminApi.getRows
      .mockResolvedValueOnce([])
      .mockResolvedValue([{ registration_id: 10, app_id: 7, scenario_id: 1 }]);
    renderEditTable(adminApi);
    await screen.findByRole("button", { name: "Add" });

    await selectScenarios(["IGX_2018"]);
    const table = screen.getByRole("table");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    // The same table element is still mounted throughout — no "Loading…" placeholder swap,
    // so the section keeps its height and the page keeps its scroll position.
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
    expect(screen.getByRole("table")).toBe(table);
    await waitFor(() => expect(screen.getByText("IGX_2018")).toBeInTheDocument());
  });
});
