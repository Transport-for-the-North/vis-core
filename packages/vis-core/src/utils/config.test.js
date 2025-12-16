/**
 * @file config.test.js
 *
 * Jest test suite for config-based utilities.
 */
import { makeFilter } from './testHelpers'
import { formatNumber } from "./text";
import * as text from "./text";
import {
  replacePlaceholdersInObject,
  replacePlaceholders,
  filterGlossaryData,
  isParamNameForceRequired,
  buildParamsMap,
  isWindows10OrLower,
  getScrollbarWidth,
  buildDeterministicFilterId,
  applyWhereConditions,
} from "./config";


describe("replacePlaceholdersInObject", () => {
  it("replaces simple @placeholders@ in strings using source data", () => {
    const target = {
      name: "@first@ @last@",
      nested: { city: "@city@" },
      arr: ["@item1@", "@item2@", 42],
      untouched: true,
    };
    const source = { first: "John", last: "Doe", city: "London", item1: "A", item2: "B" };

    const result = replacePlaceholdersInObject(target, source);
    expect(result).toEqual({
      name: "John Doe",
      nested: { city: "London" },
      arr: ["A", "B", 42],
      untouched: true,
    });
  });

  it("throws when a placeholder key is missing in the source", () => {
    const target = { msg: "Hello @who@" };
    const source = {};
    expect(() => replacePlaceholdersInObject(target, source)).toThrow(
      /Placeholder key "who" not found/
    );
  });

  it("throws when target or source is not a non-null object", () => {
    expect(() => replacePlaceholdersInObject(null, {})).toThrow(TypeError);
    expect(() => replacePlaceholdersInObject({}, null)).toThrow(TypeError);
    expect(() => replacePlaceholdersInObject([], {})).toThrow(TypeError);
    expect(() => replacePlaceholdersInObject({}, [])).toThrow(TypeError);
  });

  it("leaves non-string items unchanged", () => {
    const target = { num: 10, bool: false, nil: null, undef: undefined, str: "@x@" };
    const source = { x: "ok" };
    const result = replacePlaceholdersInObject(target, source);
    expect(result).toEqual({ num: 10, bool: false, nil: null, undef: undefined, str: "ok" });
  });
});

describe("replacePlaceholders", () => {
  let numSpy;
  let ordSpy;

  beforeEach(() => {
    // Spies keep the real implementation by default
    numSpy = jest.spyOn(text, "formatNumber");
    ordSpy = jest.spyOn(text, "formatOrdinal");
  });

  afterEach(() => {
    // Restore after each test so spies don't leak
    numSpy.mockRestore();
    ordSpy.mockRestore();
  });

  it("replaces simple {key} placeholders", () => {
    const html = "<div>{a} {b} {missing}</div>";
    const data = { a: "one", b: 2 };
    const result = replacePlaceholders(html, data);
    expect(result).toBe("<div>one 2 N/A</div>");
  });

  it("applies colon syntax {fn:key} with default allowed functions", () => {
    const html = "<span>{formatNumber:value} and {formatOrdinal:rank}</span>";
    const data = { value: 1234, rank: 3 };
    const result = replacePlaceholders(html, data);
    expect(numSpy).toHaveBeenCalledWith(1234);
    expect(ordSpy).toHaveBeenCalledWith(3);
    expect(result).toBe("<span>1,234 and 3rd</span>");
  });

  it("applies parentheses syntax {fn(key)} with default allowed functions", () => {
    const html = "<span>{formatNumber(value)} then {formatOrdinal(rank)}</span>";
    const data = { value: 1000, rank: 21 };
    const result = replacePlaceholders(html, data);
    expect(numSpy).toHaveBeenCalledWith(1000);
    expect(ordSpy).toHaveBeenCalledWith(21);
    expect(result).toBe("<span>1,000 then 21st</span>");
  });

  it("supports custom functions; 1-arg receives value, 2+-arg receives (value, data)", () => {
    const html = "<div>{double:n}&nbsp;{percent(score)}</div>";
    const data = { n: 7, score: 0.5, total: 1 };
    const customFunctions = {
      double: (v) => v * 2,
      percent: (v, d) => `${(v / d.total) * 100}%`,
    };
    const result = replacePlaceholders(html, data, { customFunctions });
    expect(result).toBe("<div>14&nbsp;50%</div>");
  });

  it("returns N/A when arg is undefined (parentheses syntax)", () => {
    const html = "<div>{formatNumber(value)}</div>";
    const data = {};
    const result = replacePlaceholders(html, data);
    expect(result).toBe("<div>N/A</div>");
  });

  it("leaves placeholder intact when function is not allowed", () => {
    const html = "<div>{unknownFn:value}</div>";
    const data = { value: 10 };
    const result = replacePlaceholders(html, data);
    expect(result).toBe("<div>{unknownFn:value}</div>");
  });

  it("handles dot keys literally (no deep get) for parentheses syntax", () => {
    const html = "<div>{formatNumber(a.b)}</div>";
    const data = { "a.b": 99 };
    const result = replacePlaceholders(html, data);
    expect(formatNumber).toHaveBeenCalledWith(99);
    expect(result).toBe("<div>99</div>");
  });

  it("falls back to raw arg as string if function throws (colon syntax)", () => {
    const html = "<div>{boom:x}</div>";
    const data = { x: 3 };
    const customFunctions = {
      boom: () => {
        throw new Error("bad");
      },
    };
    const result = replacePlaceholders(html, data, { customFunctions });
    expect(result).toBe("<div>3</div>");
  });

  it("leaves colon placeholder intact when arg is undefined", () => {
    const html = "<div>{formatNumber:missing}</div>";
    const data = {};
    const result = replacePlaceholders(html, data);
    // For colon syntax, undefined args keep the placeholder
    expect(result).toBe("<div>{formatNumber:missing}</div>");
  });

  it("respects keepUndefined=true for simple and parentheses placeholders", () => {
    const html = "<div>{a} {formatNumber(b)} {unknownFn:c}</div>";
    const data = {}; // all missing
    const result = replacePlaceholders(html, data, { keepUndefined: true });
    // {a} untouched, {formatNumber(b)} untouched (parentheses), {unknownFn:c} untouched because fn not allowed
    expect(result).toBe("<div>{a} {formatNumber(b)} {unknownFn:c}</div>");
  });

  it("handles dot keys literally for colon syntax as well", () => {
    const html = "<div>{formatNumber:a.b}</div>";
    const data = { "a.b": 77 };
    const result = replacePlaceholders(html, data);
    expect(numSpy).toHaveBeenCalledWith(77);
    expect(result).toBe("<div>77</div>");
  });
});

describe("filterGlossaryData", () => {
  const glossaryData = {
    a: { definition: "A", exclude: ["x", "y"] },
    b: { definition: "B", exclude: ["z"] },
    c: { definition: "C", exclude: [] },
    d: { definition: "D" }, // missing exclude treated as []
  };

  it("filters using an array excludeList", () => {
    const result = filterGlossaryData(glossaryData, ["x", "z"]);
    expect(result).toEqual({ 
        c: { definition: "C", exclude: [] },
        d: { definition: "D" }
    });
  });

  it("filters using a string excludeList", () => {
    const result = filterGlossaryData(glossaryData, "x");
    expect(result).toEqual({
      b: { definition: "B", exclude: ["z"] },
      c: { definition: "C", exclude: [] },
      d: { definition: "D" },
    });
  });

  it("returns all entries when excludeList is empty array or empty string", () => {
    const resultEmptyArray = filterGlossaryData(glossaryData, []);
    expect(resultEmptyArray).toEqual(glossaryData);

    const resultEmptyString = filterGlossaryData(glossaryData, "");
    // No term has an empty-string exclusion, so all should pass
    expect(resultEmptyString).toEqual(glossaryData);
  });
});

describe("isParamNameForceRequired", () => {
  it("returns true when a filter has forceRequired=true for the param", () => {
    const filters = [makeFilter("a", undefined, true), makeFilter("b", undefined, false)];
    expect(isParamNameForceRequired(filters, "a")).toBe(true);
    expect(isParamNameForceRequired(filters, "b")).toBe(false);
  });

  it("returns false when filter not found", () => {
    const filters = [makeFilter("a", undefined, true)];
    expect(isParamNameForceRequired(filters, "missing")).toBe(false);
  });
});

describe("buildParamsMap", () => {
  it("builds query map honoring required and defaults; forceRequired via filters", () => {
    const parameters = [
      { in: "query", name: "q1", required: false, schema: { default: "dq1" } },
      { in: "query", name: "q2", required: true },
      { in: "query", name: "q3", required: false },
      { in: "path", name: "id", required: false, schema: { default: 10 } }, // ignored in this call
    ];
    const filters = [makeFilter("q3", undefined, true)]; // force q3 required = true

    const map = buildParamsMap(parameters, "query", filters);
    expect(map).toEqual({
      q1: { value: "dq1", required: false },
      q2: { value: null, required: true },
      q3: { value: null, required: true },
    });
  });

  it("builds path map where all are required regardless of schema.required", () => {
    const parameters = [
      { in: "path", name: "id", required: false, schema: { default: 99 } },
      { in: "path", name: "slug", required: true },
      { in: "query", name: "q", required: false }, // ignored in this call
    ];
    const map = buildParamsMap(parameters, "path", []);
    expect(map).toEqual({
      id: { value: 99, required: true },
      slug: { value: null, required: true },
    });
  });
});

describe("isWindows10OrLower", () => {
  const getUA = () => navigator.userAgent;
  let uaGetterSpy;

  beforeEach(() => {
    // Spy on userAgent getter
    uaGetterSpy = jest.spyOn(window.navigator, "userAgent", "get");
  });

  afterEach(() => {
    uaGetterSpy.mockRestore();
  });

  it("returns true for Windows 10 (NT 10.0)", () => {
    uaGetterSpy.mockReturnValue(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );
    expect(getUA()).toMatch(/Windows NT 10\.0/);
    expect(isWindows10OrLower()).toBe(true);
  });

  it("returns false for Windows 11+ (NT 11.0)", () => {
    uaGetterSpy.mockReturnValue(
      "Mozilla/5.0 (Windows NT 11.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );
    expect(isWindows10OrLower()).toBe(false);
  });

  it("returns false when not a Windows UA", () => {
    uaGetterSpy.mockReturnValue(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16 Safari/605.1.15"
    );
    expect(isWindows10OrLower()).toBe(false);
  });

  it("returns true for Windows 8.1 (NT 6.3)", () => {
    uaGetterSpy.mockReturnValue(
      "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 Chrome/114 Safari/537.36"
    );
    expect(isWindows10OrLower()).toBe(true);
  });
});

describe("getScrollbarWidth", () => {
  it("calculates scrollbar width using DOM elements", () => {
    // Wrap original createElement so we can control offsetWidth on the created elements.
    const originalCreateElement = document.createElement.bind(document);
    let call = 0;

    const createSpy = jest.spyOn(document, "createElement").mockImplementation((tag) => {
      const el = originalCreateElement(tag);
      // First call -> outer, Second call -> inner
      if (call === 0) {
        Object.defineProperty(el, "offsetWidth", { configurable: true, get: () => 100 });
      } else if (call === 1) {
        Object.defineProperty(el, "offsetWidth", { configurable: true, get: () => 80 });
      }
      call += 1;
      return el;
    });

    const width = getScrollbarWidth("thin");
    expect(width).toBe(20);

    createSpy.mockRestore();
  });

  it("returns 0 when widths are equal or cannot be determined", () => {
    const originalCreateElement = document.createElement.bind(document);
    let call = 0;

    const createSpy = jest.spyOn(document, "createElement").mockImplementation((tag) => {
      const el = originalCreateElement(tag);
      // Make both offsets equal
      Object.defineProperty(el, "offsetWidth", { configurable: true, get: () => 100 });
      call += 1;
      return el;
    });

    const width = getScrollbarWidth("auto");
    expect(width).toBe(0);

    createSpy.mockRestore();
  });
});

describe("buildDeterministicFilterId", () => {
  it("builds a slugged id from stable fields", () => {
    const used = new Set();
    const filter = {
      paramName: "Q1",
      filterName: "My Filter",
      type: "select",
      visualisations: ["Alpha", "Beta"]
    };
    const id = buildDeterministicFilterId(filter, used);
    // visualisations joined with '|' then slugified -> alpha-beta
    expect(id).toBe("q1__my-filter__select__alpha-beta");
    expect(used.has(id)).toBe(true);
  });

  it("ensures uniqueness with deterministic suffix", () => {
    const used = new Set(["q1__my-filter__select__alpha-beta"]);
    const filter = {
      paramName: "Q1",
      filterName: "My Filter",
      type: "select",
      visualisations: ["Alpha", "Beta"]
    };
    const id2 = buildDeterministicFilterId(filter, used);
    expect(id2).toBe("q1__my-filter__select__alpha-beta--2");
    expect(used.has(id2)).toBe(true);

    const id3 = buildDeterministicFilterId(filter, used);
    expect(id3).toBe("q1__my-filter__select__alpha-beta--3");
    expect(used.has(id3)).toBe(true);
  });

  it("falls back to 'filter' when all parts are empty", () => {
    const used = new Set();
    const id = buildDeterministicFilterId({}, used);
    expect(id).toBe("filter");

    // Next call collides and should suffix
    const id2 = buildDeterministicFilterId({}, used);
    expect(id2).toBe("filter--2");
  });
});

describe("applyWhereConditions", () => {
  const rows = [
    { id: 1, status: "active", score: 10, tag: null },
    { id: 2, status: "inactive", score: 20, tag: undefined },
    { id: 3, status: "active", score: 30, tag: "x" },
    { id: 4, status: "pending", score: 20, tag: "y" },
  ];

  it("supports 'in' with scalar and array values", () => {
    const r1 = applyWhereConditions(rows, { column: "status", values: "active", operator: "in" });
    expect(r1.map(r => r.id)).toEqual([1, 3]);

    const r2 = applyWhereConditions(rows, { column: "score", values: [20, 30], operator: "in" });
    expect(r2.map(r => r.id)).toEqual([2, 3, 4]);
  });

  it("supports 'notIn'", () => {
    const r = applyWhereConditions(rows, { column: "status", values: ["inactive", "pending"], operator: "notIn" });
    expect(r.map(r => r.id)).toEqual([1, 3]);
  });

  it("supports 'equals' and 'notEquals'", () => {
    const eq = applyWhereConditions(rows, { column: "score", values: 20, operator: "equals" });
    expect(eq.map(r => r.id)).toEqual([2, 4]);

    const ne = applyWhereConditions(rows, { column: "status", values: "active", operator: "notEquals" });
    expect(ne.map(r => r.id)).toEqual([2, 4]);
  });

  it("supports 'isNull' and 'notNull'", () => {
    const isNull = applyWhereConditions(rows, { column: "tag", operator: "isNull" });
    // tag null or undefined => ids 1,2
    expect(isNull.map(r => r.id)).toEqual([1, 2]);

    const notNull = applyWhereConditions(rows, { column: "tag", operator: "notNull" });
    expect(notNull.map(r => r.id)).toEqual([3, 4]);
  });

  it("ANDs multiple conditions together", () => {
    const where = [
      { column: "status", values: "active", operator: "equals" },
      { column: "score", values: [10, 20], operator: "in" }, // only score 10 matches among active
    ];
    const r = applyWhereConditions(rows, where);
    expect(r.map(r => r.id)).toEqual([1]);
  });

  it("ignores malformed conditions (no column) by treating them as pass-through", () => {
    const where = [
      null,
      { }, // missing column
      { column: "status", values: "pending", operator: "equals" },
    ];
    const r = applyWhereConditions(rows, where);
    expect(r.map(r => r.id)).toEqual([4]);
  });
});