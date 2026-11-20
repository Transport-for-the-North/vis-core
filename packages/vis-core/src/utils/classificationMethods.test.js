import {
  jenksBreaks,
  kMeansBreaks,
  standardDeviationBreaks,
} from "./classificationMethods";

// Three tight groups: any sensible clustering puts a class boundary at 10 and 20.
const grouped = [1, 2, 3, 10, 11, 12, 20, 21, 22];

// Skewed like real transport data: most values low, a long tail of high ones.
let seed = 1;
const random = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
const skewed = Array.from({ length: 2000 }, () =>
  Math.round(Math.exp(random() * 3 + random() * 3 + random() * 2))
);

const isAscending = (values) => values.every((v, i) => i === 0 || v > values[i - 1]);

describe("jenksBreaks", () => {
  it("returns the lowest value of each natural group", () => {
    expect(jenksBreaks(grouped, 3)).toEqual([1, 10, 20]);
  });

  it("does not return the minimum's neighbour as a junk second break", () => {
    // Before the fix this gave [1, 2, 35, 68].
    const breaks = jenksBreaks(Array.from({ length: 100 }, (_, i) => i + 1), 4);
    expect(breaks).toHaveLength(4);
    expect(breaks[1]).toBeGreaterThan(10);
  });

  it.each([3, 5, 9])("gives %i distinct ascending breaks on skewed data", (n) => {
    const breaks = jenksBreaks(skewed, n);
    expect(breaks).toHaveLength(n);
    expect(isAscending(breaks)).toBe(true);
  });

  it("returns the distinct values when there are no more than the classes", () => {
    expect(jenksBreaks([5, 1, 5, 3], 4)).toEqual([1, 3, 5]);
  });
});

describe("kMeansBreaks", () => {
  it("returns the lowest value of each cluster", () => {
    expect(kMeansBreaks(grouped, 3)).toEqual([1, 10, 20]);
  });

  it.each([3, 5, 7, 9])("gives %i clusters on skewed data, not fewer", (n) => {
    const breaks = kMeansBreaks(skewed, n);
    expect(breaks).toHaveLength(n);
    expect(breaks[0]).toBe(Math.min(...skewed));
    expect(isAscending(breaks)).toBe(true);
  });

  it("returns the distinct values when there are no more than the classes", () => {
    expect(kMeansBreaks([2, 2, 7, 7, 9], 3)).toEqual([2, 7, 9]);
  });
});

describe("standardDeviationBreaks", () => {
  it("starts at the minimum and steps whole standard deviations from the mean", () => {
    // 1..100: mean 50.5, standard deviation ~28.87.
    const breaks = standardDeviationBreaks(Array.from({ length: 100 }, (_, i) => i + 1), 4);
    expect(breaks[0]).toBe(1);
    expect(breaks[1]).toBeCloseTo(21.63, 1);
    expect(breaks[2]).toBeCloseTo(50.5, 5);
    expect(breaks[3]).toBeCloseTo(79.37, 1);
  });

  it("uses smaller steps when whole standard deviations don't fit", () => {
    // 1..100 fits only three whole-step bounds inside the range, so 6 classes need halves.
    const data = Array.from({ length: 100 }, (_, i) => i + 1);
    const breaks = standardDeviationBreaks(data, 6);
    expect(breaks).toHaveLength(6);
    expect(breaks[2] - breaks[1]).toBeCloseTo(28.87 / 2, 1);
  });

  it.each([3, 4, 7, 9])("gives %i classes on skewed data", (n) => {
    const breaks = standardDeviationBreaks(skewed, n);
    expect(breaks).toHaveLength(n);
    expect(breaks[0]).toBe(Math.min(...skewed));
    expect(isAscending(breaks)).toBe(true);
    expect(breaks[n - 1]).toBeLessThan(Math.max(...skewed));
  });

  it("returns the distinct values when there are no more than the classes", () => {
    expect(standardDeviationBreaks([4, 4, 8], 3)).toEqual([4, 8]);
  });

  it("returns nothing for no data", () => {
    expect(standardDeviationBreaks([], 5)).toEqual([]);
  });
});
