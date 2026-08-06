import { getOutOfBandFlags } from './DynamicLegend.utils';

describe('getOutOfBandFlags', () => {
  it('does not throw a call stack size exceeded error for very large datasets', () => {
    // Create an array with > 150,000 items to trigger the spread operator stack size limit
    // if Math.max(...values) or similar is used.
    const largeData = Array.from({ length: 200000 }, (_, i) => ({ value: i }));
    const numericEntries = [10000, 190000];

    // This should not throw an error
    expect(() => {
      const result = getOutOfBandFlags(largeData, numericEntries);
      expect(result.belowMin).toBe(true);
      expect(result.aboveMax).toBe(true);
    }).not.toThrow();
  });
  it('does not flag as out of band for minor precision differences within tolerance', () => {
    // The tolerance is 0.005001. A difference of 0.004 should NOT trigger the flag.
    const data = [{ value: 2936.004 }, { value: 99.996 }];
    // Band limits are [100, 2936]
    const numericEntries = [100, 1500, 2936];

    const result = getOutOfBandFlags(data, numericEntries);
    expect(result.belowMin).toBe(false);
    expect(result.aboveMax).toBe(false);
  });

  it('correctly flags as out of band for genuine differences outside tolerance', () => {
    // The tolerance is 0.005001. A difference of 0.01 SHOULD trigger the flag.
    const data = [{ value: 2936.01 }, { value: 99.99 }];
    // Band limits are [100, 2936]
    const numericEntries = [100, 1500, 2936];

    const result = getOutOfBandFlags(data, numericEntries);
    expect(result.belowMin).toBe(true);
    expect(result.aboveMax).toBe(true);
  });
});
