# Testing Guide

This document provides comprehensive information about testing in the vis-core package.

## Table of Contents

- [Overview](#overview)
- [Running Tests](#running-tests)
- [Testing Stack](#testing-stack)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [Common Patterns](#common-patterns)
- [Debugging Tests](#debugging-tests)
- [Best Practices](#best-practices)

## Overview

The vis-core package uses Jest as the test runner along with React Testing Library for component testing. All tests are located alongside their source files with the `.test.jsx` or `.test.js` extension.

## Running Tests

### Run All Tests

```bash
npm test
```

This command runs all tests once and exits. It uses the `--passWithNoTests` flag, so it won't fail if no tests are found.

### Run Tests in Watch Mode

```bash
npm run test:watch
```

This command runs tests in watch mode, which automatically re-runs tests when files change. Useful during development.

### Run Specific Tests

```bash
# Run tests matching a pattern
npm test -- --testNamePattern="CalloutCard"

# Run tests in a specific file
npm test -- src/Components/MapLayout/CalloutCards/CalloutCardVisualisation.test.jsx

# Run tests with coverage
npm test -- --coverage
```

## Testing Stack

### Core Libraries

- **Jest**: Test runner and assertion library
- **@testing-library/react**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom Jest matchers for DOM assertions

### Environment

- **jest-environment-jsdom**: Simulates a browser environment in Node.js
- **babel-jest**: Transforms JSX and modern JavaScript for Jest

## Test Structure

Tests follow a standard structure:

```javascript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentName } from "./ComponentName";

// Mock dependencies if needed
jest.mock("dependency-name");

describe("ComponentName", () => {
  // Setup common test data
  const mockProps = {
    // ... props
  };

  // Clean up after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    render(<ComponentName {...mockProps} />);
    expect(screen.getByText("Expected Text")).toBeInTheDocument();
  });

  it("should handle user interaction", async () => {
    render(<ComponentName {...mockProps} />);
    const button = screen.getByRole("button");
    await userEvent.click(button);
    
    await waitFor(() => {
      expect(screen.getByText("Updated Text")).toBeInTheDocument();
    });
  });
});
```

## Writing Tests

### Testing React Components

#### Basic Rendering

```javascript
import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

it("renders the component", () => {
  render(<MyComponent title="Hello" />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

#### With Context Providers

Many components require context providers (MapContext, AppContext, etc.):

```javascript
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { MapContext } from "contexts";
import { MyComponent } from "./MyComponent";

it("renders with context", () => {
  const mockMapContext = {
    state: { /* ... */ },
    dispatch: jest.fn()
  };

  const theme = { /* ... */ };

  render(
    <ThemeProvider theme={theme}>
      <MapContext.Provider value={mockMapContext}>
        <MyComponent />
      </MapContext.Provider>
    </ThemeProvider>
  );

  expect(screen.getByText("Expected Text")).toBeInTheDocument();
});
```

#### With React Router

Components using routing hooks need a Router wrapper:

```javascript
import { MemoryRouter } from "react-router-dom";

it("renders with routing", () => {
  render(
    <MemoryRouter initialEntries={["/path"]}>
      <MyComponent />
    </MemoryRouter>
  );
});
```

### Testing User Interactions

Always use `async/await` with user events:

```javascript
import userEvent from "@testing-library/user-event";

it("handles button click", async () => {
  const handleClick = jest.fn();
  render(<button onClick={handleClick}>Click me</button>);
  
  const button = screen.getByRole("button");
  await userEvent.click(button);
  
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Testing Asynchronous Behavior

Use `waitFor` for assertions that need to wait for state updates:

```javascript
import { waitFor } from "@testing-library/react";

it("updates after async operation", async () => {
  render(<MyComponent />);
  
  const button = screen.getByRole("button");
  await userEvent.click(button);
  
  await waitFor(() => {
    expect(screen.getByText("Loading complete")).toBeInTheDocument();
  });
});
```

### Mocking

#### Mocking Modules

```javascript
// Mock an entire module
jest.mock("hooks", () => ({
  useFetchVisualisationData: jest.fn()
}));

// Mock specific functions
jest.mock("@heroicons/react/24/solid", () => ({
  ChevronRightIcon: (props) => <span>ChevronRight</span>,
  ChevronLeftIcon: (props) => <span>ChevronLeft</span>
}));
```

#### Mocking Context Values

```javascript
const mockAppContext = {
  apiSchema: { /* ... */ },
  appPages: [ /* ... */ ],
  // ... other properties
};

render(
  <AppContext.Provider value={mockAppContext}>
    <MyComponent />
  </AppContext.Provider>
);
```

## Common Patterns

### Querying Elements

```javascript
// By role (preferred)
screen.getByRole("button", { name: /submit/i });
screen.getByRole("heading", { level: 1 });

// By text
screen.getByText("Hello World");
screen.getByText(/hello/i); // Case-insensitive

// By test ID (use sparingly)
screen.getByTestId("custom-element");

// Query variants
screen.queryByText("Might not exist"); // Returns null if not found
screen.findByText("Appears later"); // Returns promise, waits for element
```

### Assertions

```javascript
// DOM presence
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibility
expect(element).toBeVisible();
expect(element).toHaveStyle({ display: "none" });

// Attributes
expect(element).toHaveAttribute("href", "/path");
expect(element).toHaveClass("active");

// Text content
expect(element).toHaveTextContent("Expected text");

// Form elements
expect(input).toHaveValue("value");
expect(checkbox).toBeChecked();
```

### Testing Hooks

Use `renderHook` from `@testing-library/react`:

```javascript
import { renderHook } from "@testing-library/react";
import { act } from "react";

it("tests custom hook", () => {
  const { result } = renderHook(() => useCustomHook());
  
  expect(result.current.value).toBe(initialValue);
  
  act(() => {
    result.current.setValue(newValue);
  });
  
  expect(result.current.value).toBe(newValue);
});
```

## Debugging Tests

### View Rendered Output

```javascript
import { render, screen } from "@testing-library/react";

it("debugs output", () => {
  const { debug } = render(<MyComponent />);
  
  // Print entire DOM
  debug();
  
  // Print specific element
  debug(screen.getByRole("button"));
  
  // Use screen.debug() as shorthand
  screen.debug();
});
```

### Verbose Test Output

```bash
# Run tests with verbose output
npm test -- --verbose

# Show all test names
npm test -- --verbose --listTests
```

### Troubleshooting Common Issues

#### "Unable to find element"

```javascript
// ❌ Element hasn't loaded yet
expect(screen.getByText("Loaded")).toBeInTheDocument();

// ✅ Wait for element to appear
await waitFor(() => {
  expect(screen.getByText("Loaded")).toBeInTheDocument();
});

// ✅ Or use findBy (returns promise)
expect(await screen.findByText("Loaded")).toBeInTheDocument();
```

#### "Warning: An update was not wrapped in act(...)"

```javascript
// ❌ Missing async/await
userEvent.click(button);

// ✅ Properly awaited
await userEvent.click(button);

// ❌ State updates outside act
result.current.dispatch(action);

// ✅ Wrapped in act
await act(async () => {
  result.current.dispatch(action);
});
```

#### "await is outside async function"

```javascript
// ❌ Missing async keyword
it("tests something", () => {
  await userEvent.click(button); // Error!
});

// ✅ Function marked as async
it("tests something", async () => {
  await userEvent.click(button);
});
```

#### Race Conditions with State Updates

If your component uses `requestAnimationFrame` or similar async updates:

```javascript
it("waits for animation frame", async () => {
  render(<MyComponent />);
  
  // Wait for the component to become visible
  await waitFor(() => {
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });
});
```

## Best Practices

### 1. Test User Behaviour, Not Implementation

```javascript
// ❌ Testing implementation details
expect(component.state.isOpen).toBe(true);

// ✅ Testing user-facing behaviour
expect(screen.getByText("Menu content")).toBeVisible();
```

### 2. Use Semantic Queries

```javascript
// ❌ Non-semantic query
screen.getByTestId("submit-button");

// ✅ Semantic query
screen.getByRole("button", { name: /submit/i });
```

### 3. Clean Up Mocks

```javascript
describe("ComponentName", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock call history
  });

  afterAll(() => {
    jest.restoreAllMocks(); // Restore original implementations
  });
});
```

### 4. Keep Tests Focused

Each test should verify one specific behaviour:

```javascript
// ❌ Testing multiple things
it("tests everything", () => {
  // renders correctly
  // handles clicks
  // validates input
  // submits form
});

// ✅ Separate focused tests
it("renders with correct initial state", () => { /* ... */ });
it("handles button click", () => { /* ... */ });
it("validates user input", () => { /* ... */ });
it("submits form with valid data", () => { /* ... */ });
```

### 5. Use Descriptive Test Names

```javascript
// ❌ Vague name
it("works", () => { /* ... */ });

// ✅ Descriptive name
it("displays error message when API call fails", () => { /* ... */ });
```

### 6. Arrange-Act-Assert Pattern

```javascript
it("updates count when button is clicked", async () => {
  // Arrange - Set up test data and render
  const initialCount = 0;
  render(<Counter initialCount={initialCount} />);
  
  // Act - Perform the action
  const button = screen.getByRole("button", { name: /increment/i });
  await userEvent.click(button);
  
  // Assert - Verify the result
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

### 7. Avoid Implementation Details

```javascript
// ❌ Testing internal state or class names
expect(wrapper.state().isVisible).toBe(true);
expect(element).toHaveClass("component__internal-class");

// ✅ Testing user-visible behaviour
expect(screen.getByText("Visible Content")).toBeVisible();
```

### 8. Handle Async Operations Properly

```javascript
// ❌ Not waiting for async updates
const button = screen.getByRole("button");
userEvent.click(button); // Missing await
expect(screen.getByText("Updated")).toBeInTheDocument(); // May fail

// ✅ Properly awaiting async operations
const button = screen.getByRole("button");
await userEvent.click(button);
await waitFor(() => {
  expect(screen.getByText("Updated")).toBeInTheDocument();
});
```

## Coverage Reports

Generate coverage reports to see which code is tested:

```bash
# Generate coverage report
npm test -- --coverage

# Generate coverage with HTML output
npm test -- --coverage --coverageDirectory=coverage
```

Coverage reports will be generated in the `coverage` directory. Open `coverage/lcov-report/index.html` in a browser to view detailed coverage information.

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
