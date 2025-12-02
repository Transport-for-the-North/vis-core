/**
 * @file api.test.js
 *
 * Comprehensive Jest test suite for API utilities that handle both path and query parameters.
 *
 * This test file covers:
 * - Detection of route (path) parameters in both "{param}" and ":param" styles.
 * - Detection of query parameters.
 * - Replacement and application of path parameters with proper encoding.
 * - Normalization of parameter values (including arrays).
 * - Updating a URL template with provided params (path + query), including handling unresolved placeholders.
 * - Extraction of path and query parameter names and values (including defaults).
 * - Processing of parameters with filters and exclusion lists, including separated path/query variants.
 *
 * Adjust the import path below to point to your actual module file.
 */

import {
    makeFilter
} from './testHelpers'
import {
  hasRouteParameter,
  hasRouteParameterOrQuery,
  replaceRouteParameter,
  checkSecurityRequirements,
  normaliseParamValue,
  applyPathParams,
  updateUrlParameters,
  extractRouteParams,
  extractQueryParams,
  extractAllParams,
  extractParamsWithValues,
  extractParamsWithValuesSeparated,
  processParameters,
} from "./apiParams";

describe("hasRouteParameter", () => {
  it("detects curly brace route params", () => {
    expect(hasRouteParameter("/users/{id}")).toBe(true);
  });

  it("detects colon-style route params", () => {
    expect(hasRouteParameter("/users/:id")).toBe(true);
  });

  it("excludes tile placeholders {z}/{x}/{y}", () => {
    expect(hasRouteParameter("/tiles/{z}/{x}/{y}")).toBe(false);
  });

  it("returns false when no route params exist", () => {
    expect(hasRouteParameter("/users/list")).toBe(false);
  });
});

describe("hasRouteParameterOrQuery", () => {
  it("detects curly route params", () => {
    expect(hasRouteParameterOrQuery("/api/{id}")).toBe(true);
  });

  it("detects colon route params", () => {
    expect(hasRouteParameterOrQuery("/api/:id")).toBe(true);
  });

  it("detects query params", () => {
    expect(hasRouteParameterOrQuery("/api?foo=bar")).toBe(true);
  });

  it("excludes tile placeholders and returns false if no query", () => {
    expect(hasRouteParameterOrQuery("/tiles/{z}/{x}/{y}")).toBe(false);
  });
});

describe("replaceRouteParameter", () => {
  it("replaces curly-style placeholders and encodes value", () => {
    const result = replaceRouteParameter("/users/{id}", "id", "A/B");
    expect(result).toBe("/users/A%2FB");
  });

  it("replaces colon-style placeholders and encodes value", () => {
    const result = replaceRouteParameter("/users/:id/posts", "id", "A/B");
    expect(result).toBe("/users/A%2FB/posts");
  });

  it("does not accidentally replace partial matches or substrings", () => {
    const result = replaceRouteParameter("/users/:userId-other", "userId", "123");
    expect(result).toBe("/users/:userId-other"); // only replaces segment placeholders (/.../:param/...), not suffix text
  });
});

describe("checkSecurityRequirements", () => {
  const schema = {
    paths: {
      "/secure": { get: { security: [{ apiKeyAuth: [] }, { jwtAuth: [] }] } },
      "/insecure": { get: {} },
    },
  };

  it("returns true when route has security requirements", () => {
    expect(checkSecurityRequirements(schema, "/secure")).toBe(true);
  });

  it("returns false when route has no security", () => {
    expect(checkSecurityRequirements(schema, "/insecure")).toBe(false);
  });

  it("returns false when path does not exist", () => {
    expect(checkSecurityRequirements(schema, "/missing")).toBe(false);
  });
});

describe("normalizeParamValue", () => {
  it("joins array values with commas by default", () => {
    expect(normaliseParamValue(["a", "b", "c"])).toBe("a,b,c");
  });

  it("joins array values with slashes when requested", () => {
    expect(normaliseParamValue(["a", "b"], "slash")).toBe("a/b");
  });

  it("returns non-array values as-is", () => {
    expect(normaliseParamValue(42)).toBe(42);
    expect(normaliseParamValue("foo")).toBe("foo");
  });
});

describe("applyPathParams", () => {
  it("replaces both curly and colon placeholders with encoded values", () => {
    const template = "/users/{id}/orders/:orderId";
    const result = applyPathParams(template, { id: "A/B", orderId: "x y" });
    expect(result).toBe("/users/A%2FB/orders/x%20y");
  });

  it("joins array values with slash for path segments", () => {
    const template = "/tags/{names}";
    const result = applyPathParams(template, { names: ["foo", "bar"] }, { arrayStyle: "slash" });
    // joined as "foo/bar", then encoded -> "foo%2Fbar"
    expect(result).toBe("/tags/foo%2Fbar");
  });

  it("throws when a required placeholder is missing and allowMissing=false", () => {
    const template = "/users/{id}";
    expect(() => applyPathParams(template, {}, { allowMissing: false })).toThrow(/Missing path param "id"/);
  });

  it("leaves unresolved placeholders when allowMissing=true", () => {
    const template = "/users/{id}/orders/:orderId";
    const result = applyPathParams(template, { id: 10 }, { allowMissing: true });
    expect(result).toBe("/users/10/orders/:orderId");
  });
});

describe("updateUrlParameters", () => {
  it("updates path and query using provided params, with fallback to current query", () => {
    const template = "/api/{id}/detail?foo={foo}&bar={bar}";
    const current = "/api/123/detail?foo=oldFoo&bar=oldBar";
    const params = { id: 456, foo: "newFoo" };

    const result = updateUrlParameters(template, current, params);
    expect(result).toBe("/api/456/detail?foo=newFoo&bar=oldBar");
  });

  it("encodes path params and normalizes query arrays with commas", () => {
    const template = "/api/{id}/detail?tags={tags}";
    const current = "/api/abc/detail?tags=old";
    const params = { id: "A/B", tags: ["x", "y"] };

    const result = updateUrlParameters(template, current, params);
    // id -> A%2FB, tags -> "x,y"
    expect(result).toBe("/api/A%2FB/detail?tags=x%2Cy"); // URLSearchParams encodes comma as %2C
  });

  it("only updates the provided params, leaving current/previously provided values unchanged", () => {
    const template = "/api/{id}/detail?foo={foo}&bar={bar}";
    const current = "/api/123/detail?foo=currentFoo&bar=currentBar";
    const params = { foo: "newFoo" }; // missing {id} => unresolved
    const result = updateUrlParameters(template, current, params);
    expect(result).toBe("/api/123/detail?foo=newFoo&bar=currentBar");
  });

  it("preserves curly braces in final URL by reverting URL-encoded braces", () => {
    const template = "/path/{unresolved}?q={value}";
    const current = "/path/{unresolved}?q=old";
    const params = {};
    const result = updateUrlParameters(template, current, params);
    expect(result).toBe("/path/{unresolved}?q=old");
  });
});

describe("extractRouteParams", () => {
  it("extracts both curly and colon-style parameter names", () => {
    const url = "/users/{id}/orders/:orderId/details/{opt}";
    const names = extractRouteParams(url);
    expect(names).toEqual(expect.arrayContaining(["id", "orderId", "opt"]));
  });

  it("returns empty array when no params exist", () => {
    expect(extractRouteParams("/static/path")).toEqual([]);
  });
});

describe("extractQueryParams", () => {
  it("extracts query parameter names", () => {
    const url = "/path?a=1&b=2";
    expect(extractQueryParams(url)).toEqual(["a", "b"]);
  });

  it("returns empty array when no query string present", () => {
    expect(extractQueryParams("/path")).toEqual([]);
  });
});

describe("extractAllParams", () => {
  it("returns combined route and query parameter names", () => {
    const url = "/u/{id}/:slug?foo=1&bar=2";
    const all = extractAllParams(url);
    expect(all).toEqual(expect.arrayContaining(["id", "slug", "foo", "bar"]));
  });
});

describe("extractParamsWithValues", () => {
  it("extracts route params (with defaults) and query placeholders as names", () => {
    const layerPath = "/path/{id=10}/{opt}?a={foo}&b=2";
    const params = extractParamsWithValues(layerPath);
    expect(params).toEqual({
      id: "10",
      opt: undefined,
      foo: undefined, // from a={foo}
      b: "2",
    });
  });

  it("includes colon-style params with undefined value (no defaults supported)", () => {
    const layerPath = "/path/:slug/{id}?q={foo}";
    const params = extractParamsWithValues(layerPath);
    expect(params.slug).toBeUndefined();
    expect(params.id).toBeUndefined();
    expect(params.foo).toBeUndefined();
  });
});

describe("extractParamsWithValuesSeparated", () => {
  it("separates path and query params with defaults and placeholders", () => {
    const layerPath = "/path/{id=10}/:slug?foo={bar}&baz=2";
    const separated = extractParamsWithValuesSeparated(layerPath);
    expect(separated).toEqual({
      pathParams: { id: "10", slug: undefined },
      queryParams: { bar: undefined, baz: "2" },
    });
  });

  it("handles no query or path placeholders gracefully", () => {
    const layerPath = "/path/static";
    const separated = extractParamsWithValuesSeparated(layerPath);
    expect(separated).toEqual({ pathParams: {}, queryParams: {} });
  });
});

describe("processParameters", () => {
  it("builds params from provided values and filters, tracking missing", () => {
    const allParamsWithValues = {
      id: undefined,
      foo: "",
      bar: "explicit",
      z: undefined, // will be excluded
    };

    const filters = [makeFilter("id", 123), makeFilter("foo", "fromFilter")];
    const excluded = ["z"];

    const { params, missingParams } = processParameters(allParamsWithValues, filters, excluded);
    expect(params).toEqual({
      id: 123,
      foo: "fromFilter",
      bar: "explicit",
    });
    expect(missingParams).toEqual([]); // z excluded, all others resolved
  });

  it("collects missing non-excluded params", () => {
    const allParamsWithValues = { a: undefined, b: undefined };
    const filters = [];
    const excluded = ["b"];
    const { params, missingParams } = processParameters(allParamsWithValues, filters, excluded);
    expect(params).toEqual({});
    expect(missingParams).toEqual(["a"]);
  });
});
