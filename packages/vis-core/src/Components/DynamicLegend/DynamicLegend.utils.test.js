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
});
