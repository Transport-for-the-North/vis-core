import { correctInitialCrossFilterValues, correctRuntimeCrossFilterValues } from "./validation";

/**
 * Shared metadata table used across tests.
 * Each row links a scenario (A/B) to a valid mode (1/2/3).
 *
 *   scenario | mode
 *   -------- | ----
 *   A        | 1
 *   A        | 2
 *   B        | 3
 *
 * So when scenario = "A", only modes 1 and 2 are valid.
 * When scenario = "B", only mode 3 is valid.
 */
const TABLE = "options";
const METADATA_TABLES = {
  [TABLE]: [
    { scenario: "A", mode: 1 },
    { scenario: "A", mode: 2 },
    { scenario: "B", mode: 3 },
  ],
};

/** Filter that drives narrowing of the mode filter (shouldFilterOthers). */
const scenarioFilter = {
  id: "scenarioId",
  filterName: "Scenario",
  shouldFilterOthers: true,
  shouldBeFiltered: false,
  multiSelect: false,
  values: {
    metadataTableName: TABLE,
    paramColumn: "scenario",
    values: [
      { paramValue: "A" },
      { paramValue: "B" },
    ],
  },
};

/** Filter whose visible options are narrowed by scenarioFilter (shouldBeFiltered). */
const modeFilter = {
  id: "modeId",
  filterName: "Mode",
  shouldFilterOthers: false,
  shouldBeFiltered: true,
  multiSelect: false,
  values: {
    metadataTableName: TABLE,
    paramColumn: "mode",
    values: [
      { paramValue: 1 },
      { paramValue: 2 },
      { paramValue: 3 },
    ],
  },
};

/** Multiselect variant of modeFilter. */
const modeFilterMulti = { ...modeFilter, multiSelect: true };

const FILTERS = [scenarioFilter, modeFilter];
const FILTERS_MULTI = [scenarioFilter, modeFilterMulti];

// ---------------------------------------------------------------------------

describe("correctInitialCrossFilterValues", () => {
  describe("purity", () => {
    it("does not mutate the input initialValues object", () => {
      // scenario A makes mode 3 hidden
      const initialValues = { scenarioId: "A", modeId: 3 };
      const frozen = Object.freeze({ ...initialValues });
      // Should not throw despite frozen input (spread creates a new object)
      const result = correctInitialCrossFilterValues(FILTERS, METADATA_TABLES, initialValues);
      expect(result).not.toBe(initialValues);
      // Original is unchanged
      expect(initialValues.modeId).toBe(3);
    });

    it("returns a new object reference", () => {
      const initialValues = { scenarioId: "A", modeId: 1 };
      const result = correctInitialCrossFilterValues(FILTERS, METADATA_TABLES, initialValues);
      expect(result).not.toBe(initialValues);
    });
  });

  describe("single-select correction", () => {
    it("leaves a valid value unchanged", () => {
      // mode 1 is valid when scenario = A
      const result = correctInitialCrossFilterValues(
        FILTERS,
        METADATA_TABLES,
        { scenarioId: "A", modeId: 1 },
      );
      expect(result.modeId).toBe(1);
    });

    it("replaces a hidden value with the first visible option", () => {
      // scenario A → only modes 1 and 2 are valid; mode 3 is hidden
      const result = correctInitialCrossFilterValues(
        FILTERS,
        METADATA_TABLES,
        { scenarioId: "A", modeId: 3 },
      );
      expect(result.modeId).toBe(1);
    });

    it("does not touch a null value", () => {
      const result = correctInitialCrossFilterValues(
        FILTERS,
        METADATA_TABLES,
        { scenarioId: "A", modeId: null },
      );
      expect(result.modeId).toBeNull();
    });

    it("does not touch an undefined value", () => {
      const result = correctInitialCrossFilterValues(
        FILTERS,
        METADATA_TABLES,
        { scenarioId: "A", modeId: undefined },
      );
      expect(result.modeId).toBeUndefined();
    });

    it("falls back to null when no visible option exists", () => {
      // Remove all rows so every mode is hidden
      const result = correctInitialCrossFilterValues(
        FILTERS,
        { [TABLE]: [] },
        { scenarioId: "A", modeId: 3 },
      );
      expect(result.modeId).toBeNull();
    });
  });

  describe("multi-select correction", () => {
    it("leaves a fully valid array unchanged", () => {
      // modes 1 and 2 are both valid for scenario A
      const result = correctInitialCrossFilterValues(
        FILTERS_MULTI,
        METADATA_TABLES,
        { scenarioId: "A", modeId: [1, 2] },
      );
      expect(result.modeId).toEqual([1, 2]);
    });

    it("removes hidden values from a partial array", () => {
      // mode 3 is hidden for scenario A; modes 1 and 2 remain
      const result = correctInitialCrossFilterValues(
        FILTERS_MULTI,
        METADATA_TABLES,
        { scenarioId: "A", modeId: [1, 2, 3] },
      );
      expect(result.modeId).toEqual([1, 2]);
    });

    it("falls back to all visible options when every selected value is hidden", () => {
      // scenario A hides mode 3; initial has only mode 3 selected
      const result = correctInitialCrossFilterValues(
        FILTERS_MULTI,
        METADATA_TABLES,
        { scenarioId: "A", modeId: [3] },
      );
      // Visible for scenario A: modes 1 and 2
      expect(result.modeId).toEqual([1, 2]);
    });

    it("does not touch an empty array", () => {
      const result = correctInitialCrossFilterValues(
        FILTERS_MULTI,
        METADATA_TABLES,
        { scenarioId: "A", modeId: [] },
      );
      expect(result.modeId).toEqual([]);
    });
  });

  describe("no-op cases", () => {
    it("passes through filters that do not have shouldBeFiltered set", () => {
      // scenarioId itself is not shouldBeFiltered — it should never be corrected
      const result = correctInitialCrossFilterValues(
        FILTERS,
        METADATA_TABLES,
        { scenarioId: "A", modeId: 1 },
      );
      expect(result.scenarioId).toBe("A");
    });

    it("returns initialValues unchanged when no cross-filter relationships exist", () => {
      const standaloneFilter = {
        id: "colorId",
        filterName: "Color",
        shouldFilterOthers: false,
        shouldBeFiltered: false,
        multiSelect: false,
        values: {
          metadataTableName: TABLE,
          paramColumn: "scenario",
          values: [{ paramValue: "A" }, { paramValue: "B" }],
        },
      };
      const initialValues = { colorId: "A" };
      const result = correctInitialCrossFilterValues(
        [standaloneFilter],
        METADATA_TABLES,
        initialValues,
      );
      expect(result).toEqual(initialValues);
    });

    it("leaves filter values not in metadataTables untouched", () => {
      const result = correctInitialCrossFilterValues(
        FILTERS,
        {},           // no metadata tables at all
        { scenarioId: "A", modeId: 3 },
      );
      // updateFilterValidity can't narrow anything without the table, so modeId stays
      expect(result.modeId).toBe(3);
    });
  });
});

// ---------------------------------------------------------------------------
// correctRuntimeCrossFilterValues
// ---------------------------------------------------------------------------
// These tests use pre-validated filter objects (isHidden already applied),
// which is the shape produced by updateFilterValidity. No metadata tables
// are needed because the hiding decision has already been made.

/**
 * Builds a validated filter config with isHidden applied to each option.
 * hiddenValues lists paramValues that should be marked isHidden: true.
 */
function makeValidatedFilter({ id, filterName = "Filter", multiSelect = false, options, hiddenValues = [] }) {
  return {
    id,
    filterName,
    shouldBeFiltered: true,
    multiSelect,
    values: {
      values: options.map((v) => ({
        paramValue: v,
        isHidden: hiddenValues.includes(v),
      })),
    },
  };
}

describe("correctRuntimeCrossFilterValues", () => {
  let dispatch;

  beforeEach(() => {
    dispatch = jest.fn();
  });

  describe("return value", () => {
    it("returns false when no correction is needed", () => {
      const filter = makeValidatedFilter({ id: "modeId", options: [1, 2, 3] });
      const result = correctRuntimeCrossFilterValues([filter], { modeId: 1 }, dispatch);
      expect(result).toBe(false);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("returns true when a correction is dispatched", () => {
      const filter = makeValidatedFilter({ id: "modeId", options: [1, 2, 3], hiddenValues: [1] });
      const result = correctRuntimeCrossFilterValues([filter], { modeId: 1 }, dispatch);
      expect(result).toBe(true);
    });
  });

  describe("single-select correction", () => {
    it("dispatches SET_FILTER_VALUE with the first visible option when current is hidden", () => {
      const filter = makeValidatedFilter({ id: "modeId", options: [1, 2, 3], hiddenValues: [1] });
      correctRuntimeCrossFilterValues([filter], { modeId: 1 }, dispatch);
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_FILTER_VALUE",
        payload: { filterId: "modeId", value: 2, filter },
      });
    });

    it("dispatches null when every option is hidden", () => {
      const filter = makeValidatedFilter({ id: "modeId", options: [1, 2], hiddenValues: [1, 2] });
      correctRuntimeCrossFilterValues([filter], { modeId: 1 }, dispatch);
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_FILTER_VALUE",
        payload: { filterId: "modeId", value: null, filter },
      });
    });

    it("does not dispatch when current value is visible", () => {
      const filter = makeValidatedFilter({ id: "modeId", options: [1, 2, 3], hiddenValues: [3] });
      correctRuntimeCrossFilterValues([filter], { modeId: 1 }, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("does not dispatch when current value is null", () => {
      const filter = makeValidatedFilter({ id: "modeId", options: [1, 2], hiddenValues: [1] });
      correctRuntimeCrossFilterValues([filter], { modeId: null }, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("does not dispatch when current value is undefined", () => {
      const filter = makeValidatedFilter({ id: "modeId", options: [1, 2], hiddenValues: [1] });
      correctRuntimeCrossFilterValues([filter], { modeId: undefined }, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("multi-select correction", () => {
    it("dispatches with only the visible subset when some are hidden", () => {
      const filter = makeValidatedFilter({
        id: "modeId", multiSelect: true, options: [1, 2, 3], hiddenValues: [3],
      });
      correctRuntimeCrossFilterValues([filter], { modeId: [1, 2, 3] }, dispatch);
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_FILTER_VALUE",
        payload: { filterId: "modeId", value: [1, 2], filter },
      });
    });

    it("dispatches all visible options when every selected value is hidden", () => {
      const filter = makeValidatedFilter({
        id: "modeId", multiSelect: true, options: [1, 2, 3], hiddenValues: [1, 2],
      });
      correctRuntimeCrossFilterValues([filter], { modeId: [1, 2] }, dispatch);
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_FILTER_VALUE",
        payload: { filterId: "modeId", value: [3], filter },
      });
    });

    it("does not dispatch when all selected values are visible", () => {
      const filter = makeValidatedFilter({
        id: "modeId", multiSelect: true, options: [1, 2, 3], hiddenValues: [3],
      });
      correctRuntimeCrossFilterValues([filter], { modeId: [1, 2] }, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("does not dispatch for an empty array", () => {
      const filter = makeValidatedFilter({
        id: "modeId", multiSelect: true, options: [1, 2], hiddenValues: [1],
      });
      correctRuntimeCrossFilterValues([filter], { modeId: [] }, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("no-op cases", () => {
    it("skips filters without shouldBeFiltered", () => {
      const filter = {
        id: "scenarioId",
        shouldBeFiltered: false,
        values: { values: [{ paramValue: "A", isHidden: false }] },
      };
      correctRuntimeCrossFilterValues([filter], { scenarioId: "A" }, dispatch);
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("dispatches once per corrected filter across multiple filters", () => {
      const filterA = makeValidatedFilter({ id: "aId", options: [1, 2], hiddenValues: [1] });
      const filterB = makeValidatedFilter({ id: "bId", options: [3, 4], hiddenValues: [3] });
      correctRuntimeCrossFilterValues([filterA, filterB], { aId: 1, bId: 3 }, dispatch);
      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });
});
