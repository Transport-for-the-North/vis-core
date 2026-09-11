import {
  BASE_MAPS,
  DEFAULT_BASE_MAP_ID,
  getBaseMap,
  resolveBaseMapStyle,
  validateBaseMapDescriptor,
} from "./baseMaps";
import {
  readBaseMapPreference,
  writeBaseMapPreference,
} from "./baseMapPreference";

describe("baseMaps", () => {
  it("ensures every catalogue descriptor has explicit id, theme, and resolveStyle", () => {
    Object.values(BASE_MAPS).forEach((descriptor) => {
      expect(typeof descriptor.id).toBe("string");
      expect(["light", "dark"]).toContain(descriptor.theme);
      expect(typeof descriptor.resolveStyle).toBe("function");
      expect(typeof descriptor.resolveStyle()).toBe("string");
      expect(() => validateBaseMapDescriptor(descriptor)).not.toThrow();
    });
  });

  it("throws for invalid descriptors", () => {
    expect(() => validateBaseMapDescriptor(null)).toThrow("Base map requires an id");
    expect(() => validateBaseMapDescriptor({ id: "missing-theme" })).toThrow(
      'Base map "missing-theme" requires theme "light" or "dark"'
    );
    expect(() =>
      validateBaseMapDescriptor({ id: "invalid-theme", theme: "sepia" })
    ).toThrow('Base map "invalid-theme" requires theme "light" or "dark"');
    expect(() =>
      validateBaseMapDescriptor({ id: "no-resolver", theme: "light" })
    ).toThrow('Base map "no-resolver" requires resolveStyle()');
  });

  it("requires theme 'dark' for dark maps rather than inferring from URL", () => {
    const descriptor = {
      id: "customDark",
      theme: "dark",
      resolveStyle: () => "https://example.com/dark-style",
    };
    expect(() => validateBaseMapDescriptor(descriptor)).not.toThrow();
    expect(descriptor.theme).toBe("dark");

    const invalidDescriptor = {
      id: "customDarkWithoutTheme",
      resolveStyle: () => "https://example.com/dark-style",
    };
    expect(() => validateBaseMapDescriptor(invalidDescriptor)).toThrow();
  });

  it("resolves default descriptor deterministically when id is unknown", () => {
    expect(DEFAULT_BASE_MAP_ID).toBe("positron");
    expect(getBaseMap("unknown-id")).toBe(BASE_MAPS[DEFAULT_BASE_MAP_ID]);
    expect(getBaseMap(undefined)).toBe(BASE_MAPS[DEFAULT_BASE_MAP_ID]);
  });

  it("resolves style using resolveBaseMapStyle helper", () => {
    const style = resolveBaseMapStyle(BASE_MAPS.positron);
    expect(typeof style).toBe("string");
    expect(style).toContain("https://");
  });
});

describe("baseMapPreference", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("removes invalid persisted IDs and returns null", () => {
    localStorage.setItem("vis-core-base-map", "non-existent-map");
    const result = readBaseMapPreference(BASE_MAPS);

    expect(result).toBeNull();
    expect(localStorage.getItem("vis-core-base-map")).toBeNull();
  });

  it("reads valid persisted base map ID", () => {
    writeBaseMapPreference("darkMatter");
    expect(readBaseMapPreference(BASE_MAPS)).toBe("darkMatter");
  });

  it("returns null when no preference is saved", () => {
    expect(readBaseMapPreference(BASE_MAPS)).toBeNull();
  });
});
