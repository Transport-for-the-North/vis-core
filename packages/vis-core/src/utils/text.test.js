import { formatNumber, formatValueWithUnit } from "./text";

describe("formatNumber", () => {
  it("formats integers under 1000 with trailing zeroes by default", () => {
    expect(formatNumber(150)).toBe("150.00");
    expect(formatNumber(999)).toBe("999.00");
  });

  it("strips trailing zeroes for integers under 1000 when stripTrailingZeroes is true", () => {
    expect(formatNumber(150, { stripTrailingZeroes: true })).toBe("150");
    expect(formatNumber(999, { stripTrailingZeroes: true })).toBe("999");
  });

  it("retains decimals for non-integers under 1000 even when stripTrailingZeroes is true", () => {
    expect(formatNumber(150.55, { stripTrailingZeroes: true })).toBe("150.55");
    expect(formatNumber(150.5, { stripTrailingZeroes: true })).toBe("150.5");
  });

  it("handles zero cleanly", () => {
    expect(formatNumber(0)).toBe("0.00");
    expect(formatNumber(0, { stripTrailingZeroes: true })).toBe("0");
  });

  it("formats numbers over 1000 cleanly", () => {
    expect(formatNumber(1500)).toBe("1,500");
    expect(formatNumber(15000)).toBe("15.00K");
    expect(formatNumber(1500000)).toBe("1.50M");
  });
});

describe("formatValueWithUnit", () => {
  it("formats currency values with prefix £", () => {
    expect(formatValueWithUnit(500, "£")).toBe("£500");
    expect(formatValueWithUnit(-500, "£")).toBe("-£500");
  });

  it("formats rates like £/week correctly", () => {
    expect(formatValueWithUnit(540, "£/week")).toBe("£540/week");
    expect(formatValueWithUnit(-120, "£/week")).toBe("-£120/week");
  });

  it("formats percentages with % suffix without space", () => {
    expect(formatValueWithUnit(12.5, "%")).toBe("12.5%");
    expect(formatValueWithUnit(-3.2, "%")).toBe("-3.2%");
  });

  it("formats general metric units like sqm and gen mins with space", () => {
    expect(formatValueWithUnit(1500, "sqm")).toBe("1,500 sqm");
    expect(formatValueWithUnit(15.2, "gen mins")).toBe("15.2 gen mins");
  });

  it("suppresses unit for count and none", () => {
    expect(formatValueWithUnit(1000, "count")).toBe("1,000");
    expect(formatValueWithUnit(1000, "none")).toBe("1,000");
    expect(formatValueWithUnit(1000, null)).toBe("1,000");
    expect(formatValueWithUnit(1000, "")).toBe("1,000");
  });
});
