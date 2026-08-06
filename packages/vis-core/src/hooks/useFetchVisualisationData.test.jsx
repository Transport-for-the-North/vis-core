import { unwrapApiResponse } from './useFetchVisualisationData';

describe('unwrapApiResponse', () => {
  it('passes a plain array through as-is', () => {
    const input = [{ id: 1 }];
    expect(unwrapApiResponse(input)).toEqual([{ id: 1 }]);
  });

  it('unwraps { data, metadata } envelope and returns the data array', () => {
    const input = { data: [{ id: 1 }], metadata: {} };
    expect(unwrapApiResponse(input)).toEqual([{ id: 1 }]);
  });

  it('passes through null as-is', () => {
    expect(unwrapApiResponse(null)).toBeNull();
  });
});