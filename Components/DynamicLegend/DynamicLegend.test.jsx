import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DynamicLegend } from './DynamicLegend';

// Mock the map object and its methods
const mockMap = {
  on: jest.fn(),
  off: jest.fn(),
  getStyle: jest.fn(),
};

// Mock the getStyle method to return a style object with layers
mockMap.getStyle.mockReturnValue({
  layers: [
    {
      id: 'test-line-layer',
      type: 'line',
      paint: {
        'line-color': '#ff0000',
        'line-width': 5,
      },
      metadata: {
        isStylable: true,
      },
    },
    // Add more layers with different paint properties as needed for testing
  ],
});

describe('DynamicLegend', () => {
  it('renders legend items based on the map layers paint properties', () => {
    render(<DynamicLegend map={mockMap} />);

    // Simulate a style change event on the map
    act(() => {
      const styleChangeHandler = mockMap.on.mock.calls.find(
        (call) => call[0] === 'styledata'
      )[1];
      styleChangeHandler();
    });

    // Check that the legend items are rendered with the correct properties
    expect(screen.getByText('test-line-layer')).toBeInTheDocument();
    expect(screen.getByText('Color: #ff0000')).toBeInTheDocument();
    expect(screen.getByText('Width: 5px')).toBeInTheDocument();
  });

  // Add more tests to cover different scenarios, such as changes to the map's style,
  // different types of paint property expressions, and layers without metadata.isStylable
});