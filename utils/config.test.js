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

  it("returns N/A when arg is undefined", () => {
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

  it("falls back to raw arg as string if function throws", () => {
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