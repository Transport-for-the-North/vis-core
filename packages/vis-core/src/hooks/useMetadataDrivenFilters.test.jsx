import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { FilterContext, PageContext } from 'contexts';
import { api } from 'services';
import { useMetadataDrivenFilters } from './useMetadataDrivenFilters';

jest.mock('services', () => ({
  api: {
    baseService: {
      get: jest.fn(),
      post: jest.fn(),
    },
  },
}));

describe('useMetadataDrivenFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sorts metadata table options by numeric-like sortColumn values', async () => {
    api.baseService.get.mockResolvedValue([
      { id: 'alpha', name: 'Alpha', display_order: '10' },
      { id: 'zebra', name: 'Zebra', display_order: '1' },
      { id: 'middle', name: 'Middle', display_order: '2' },
    ]);

    const pageContext = {
      config: {
        metadataTables: [
          { name: 'dropdown_options', path: '/metadata/dropdown-options' },
        ],
        filters: [
          {
            filterName: 'Example filter',
            paramName: 'example_filter',
            type: 'dropdown',
            values: {
              source: 'metadataTable',
              metadataTableName: 'dropdown_options',
              displayColumn: 'name',
              paramColumn: 'id',
              sortColumn: 'display_order',
              sort: 'ascending',
            },
          },
        ],
      },
    };

    const filterDispatch = jest.fn();
    const wrapper = ({ children }) => (
      <PageContext.Provider value={pageContext}>
        <FilterContext.Provider value={{ state: {}, dispatch: filterDispatch }}>
          {children}
        </FilterContext.Provider>
      </PageContext.Provider>
    );

    const { result } = renderHook(() => useMetadataDrivenFilters(), { wrapper });

    await waitFor(() => expect(result.current.isReady).toBe(true));

    expect(result.current.filters[0].values.values.map((value) => value.displayValue)).toEqual([
      'Zebra',
      'Middle',
      'Alpha',
    ]);
    expect(filterDispatch).toHaveBeenCalledWith({
      type: 'INITIALIZE_FILTERS',
      payload: expect.objectContaining({ [result.current.filters[0].id]: 'zebra' }),
    });
  });
});
