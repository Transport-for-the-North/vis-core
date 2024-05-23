import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { DynamicLegend, interpretWidthExpression, interpretColorExpression } from './DynamicLegend';
// TODO make sure the tests work ABH 2024/05/23

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



describe('interpretWidthExpression', () => {
  it('interprets a simple numeric width expression', () => {
    const expression = 5;
    const result = interpretWidthExpression(expression);
    expect(result).toEqual([{ width: 5 }]);
  });

  it('interprets a complex width expression with multiple stops', () => {
    const expression = ['interpolate', ['linear'], ['zoom'], 5, 1, 15, 3];
    const result = interpretWidthExpression(expression, 3); // Assuming 3 intermediate stops
    expect(result).toHaveLength(5); // Original stops + 3 intermediate stops
    // Add more expectations to check the correctness of the intermediate stops
  });

  // Add more test cases for different types of width expressions
});

describe('interpretColorExpression', () => {
  it('interprets a simple color string expression', () => {
    const expression = '#ff0000';
    const result = interpretColorExpression(expression);
    expect(result).toEqual([{ color: '#ff0000' }]);
  });

  it('interprets a complex color expression with match', () => {
    const expression = ['match', ['get', 'property'], 'value1', '#ff0000', 'value2', '#00ff00', '#000000'];
    const result = interpretColorExpression(expression);
    expect(result).toEqual([
      { value: 'value1', color: '#ff0000' },
      { value: 'value2', color: '#00ff00' },
    ]);
  });

  // Add more test cases for different types of color expressions
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