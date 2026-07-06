import { formatNumber } from "./text";

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
