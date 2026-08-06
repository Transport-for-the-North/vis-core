import { sortValues } from './math';

describe('sortValues', () => {
  it('sorts by displayValue in ascending order', () => {
    const values = [
      { displayValue: 'Banana', paramValue: 'banana' },
      { displayValue: 'Apple', paramValue: 'apple' },
      { displayValue: 'Cherry', paramValue: 'cherry' },
    ];

    expect(sortValues(values, 'ascending').map((value) => value.displayValue)).toEqual([
      'Apple',
      'Banana',
      'Cherry',
    ]);
  });

  it('sorts by displayValue in descending order', () => {
    const values = [
      { displayValue: 'Apple', paramValue: 'apple' },
      { displayValue: 'Cherry', paramValue: 'cherry' },
      { displayValue: 'Banana', paramValue: 'banana' },
    ];

    expect(sortValues(values, 'descending').map((value) => value.displayValue)).toEqual([
      'Cherry',
      'Banana',
      'Apple',
    ]);
  });

  it('sorts numeric-like displayValue strings numerically', () => {
    const values = [
      { displayValue: '10', paramValue: 10 },
      { displayValue: '1', paramValue: 1 },
      { displayValue: '2', paramValue: 2 },
    ];

    expect(sortValues(values, 'ascending').map((value) => value.displayValue)).toEqual([
      '1',
      '2',
      '10',
    ]);
  });

  it('sorts by numeric-like sortValue strings when provided', () => {
    const values = [
      { displayValue: 'Tenth', paramValue: 'tenth', sortValue: '10' },
      { displayValue: 'First', paramValue: 'first', sortValue: '1' },
      { displayValue: 'Second', paramValue: 'second', sortValue: '2' },
    ];

    expect(sortValues(values, 'ascending').map((value) => value.displayValue)).toEqual([
      'First',
      'Second',
      'Tenth',
    ]);
  });

  it('sorts by numeric-like sortValue strings in descending order', () => {
    const values = [
      { displayValue: 'First', paramValue: 'first', sortValue: '1' },
      { displayValue: 'Tenth', paramValue: 'tenth', sortValue: '10' },
      { displayValue: 'Second', paramValue: 'second', sortValue: '2' },
    ];

    expect(sortValues(values, 'descending').map((value) => value.displayValue)).toEqual([
      'Tenth',
      'Second',
      'First',
    ]);
  });

  it('falls back to displayValue when sortValue is not provided', () => {
    const values = [
      { displayValue: 'C', paramValue: 'c' },
      { displayValue: 'A', paramValue: 'a' },
      { displayValue: 'B', paramValue: 'b' },
    ];

    expect(sortValues(values, 'ascending').map((value) => value.displayValue)).toEqual([
      'A',
      'B',
      'C',
    ]);
  });
});
