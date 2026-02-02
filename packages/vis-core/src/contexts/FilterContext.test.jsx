import { render, screen, renderHook, waitFor } from "@testing-library/react";
import { FilterProvider, FilterContext } from "contexts";
import { useContext } from "react";

describe("FilterContext", () => {
  // Helper hook pour accéder au contexte
  const useFilter = () => useContext(FilterContext);

  describe("FilterProvider", () => {
    it("renders children correctly", () => {
      render(
        <FilterProvider>
          <div>Test Child</div>
        </FilterProvider>
      );
      expect(screen.getByText("Test Child")).toBeInTheDocument();
    });

    it("provides initial state", () => {
      const TestComponent = () => {
        const { state } = useContext(FilterContext);
        return <div>State: {JSON.stringify(state)}</div>;
      };

      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      expect(screen.getByText("State: {}")).toBeInTheDocument();
    });

    it("provides dispatch function", () => {
      const TestComponent = () => {
        const { dispatch } = useContext(FilterContext);
        return (
          <div>
            Has dispatch: {typeof dispatch === "function" ? "yes" : "no"}
          </div>
        );
      };

      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      expect(screen.getByText("Has dispatch: yes")).toBeInTheDocument();
    });
  });

  describe("filterReducer actions", () => {
    it("SET_FILTER_VALUE - sets a filter value", async () => {
      const wrapper = ({ children }) => (
        <FilterProvider>{children}</FilterProvider>
      );
      const { result } = renderHook(() => useFilter(), { wrapper });

        result.current.dispatch({
          type: "SET_FILTER_VALUE",
          payload: { filterId: "age", value: "25" },
        });

        await waitFor(() => {expect(result.current.state).toEqual({ age: 25 });});
      
    });

    it("SET_FILTER_VALUE - handles boolean values", async () => {
      const wrapper = ({ children }) => (
        <FilterProvider>{children}</FilterProvider>
      );
      const { result } = renderHook(() => useFilter(), { wrapper });

        result.current.dispatch({
          type: "SET_FILTER_VALUE",
          payload: { filterId: "isActive", value: true },
        });

        await waitFor(() => {expect(result.current.state).toEqual({ isActive: true });});
      
    });

    it("SET_FILTER_VALUE - handles string values", async () => {
      const wrapper = ({ children }) => (
        <FilterProvider>{children}</FilterProvider>
      );
      const { result } = renderHook(() => useFilter(), { wrapper });

        result.current.dispatch({
          type: "SET_FILTER_VALUE",
          payload: { filterId: "name", value: "John" },
        });

        await waitFor(() => {
            expect(result.current.state).toEqual({ name: "John" });
        })
      
    });

    it("SET_FILTER_VALUE - doesn't update state if value hasn't changed", async () => {
      const wrapper = ({ children }) => (
        <FilterProvider>{children}</FilterProvider>
      );
      const { result } = renderHook(() => useFilter(), { wrapper });

      // Set initial value
        result.current.dispatch({
          type: "SET_FILTER_VALUE",
          payload: { filterId: "age", value: 25 },
        });

      const stateAfterFirstUpdate = result.current.state;

      // Try to set same value
        result.current.dispatch({
          type: "SET_FILTER_VALUE",
          payload: { filterId: "age", value: 25 },
        });

      // State reference should be the same (no new object created)
      await waitFor(() => {
        expect(result.current.state).toBe(stateAfterFirstUpdate);
      })
      
    });

    it("RESET_FILTERS - resets all filters", async () => {
      const wrapper = ({ children }) => (
        <FilterProvider>{children}</FilterProvider>
      );
      const { result } = renderHook(() => useFilter(), { wrapper });

      // Set some filters
      result.current.dispatch({
        type: "SET_FILTER_VALUE",
        payload: { filterId: "age", value: 25 },
      });
      result.current.dispatch({
        type: "SET_FILTER_VALUE",
        payload: { filterId: "name", value: "John" },
      });

      await waitFor(() => {
        expect(result.current.state).toEqual({ age: 25, name: "John" });
      });
      // Reset filters
      result.current.dispatch({ type: "RESET_FILTERS" });

      await waitFor(() => {
        expect(result.current.state).toEqual({});
      });
    });

    it("INITIALIZE_FILTERS - initializes filters with provided values", async () => {
      const wrapper = ({ children }) => (
        <FilterProvider>{children}</FilterProvider>
      );
      const { result } = renderHook(() => useFilter(), { wrapper });

      const initialFilters = {
        age: 30,
        name: "Jane",
        isActive: true,
      };

      result.current.dispatch({
        type: "INITIALIZE_FILTERS",
        payload: initialFilters,
      });

      await waitFor(() => {
        expect(result.current.state).toEqual(initialFilters);
      });
    });

    it("handles unknown action types", () => {
      const wrapper = ({ children }) => (
        <FilterProvider>{children}</FilterProvider>
      );
      const { result } = renderHook(() => useFilter(), { wrapper });

      result.current.dispatch({
        type: "UNKNOWN_ACTION",
        payload: { something: "value" },
      });

      // State should remain unchanged
      expect(result.current.state).toEqual({});
    });
  });

  describe("Integration test", () => {
    it("works with multiple filter updates", async () => {
      const TestComponent = () => {
        const { state, dispatch } = useContext(FilterContext);
        const setAgeFilter = () => {
          dispatch({
            type: "SET_FILTER_VALUE",
            payload: { filterId: "age", value: "30" },
          });
        };
        const setNameFilter = () => {
          dispatch({
            type: "SET_FILTER_VALUE",
            payload: { filterId: "name", value: "Alice" },
          });
        };
        const resetFilters = () => {
          dispatch({ type: "RESET_FILTERS" });
        };

        return (
          <div>
            <div>Filters: {JSON.stringify(state)}</div>
            <button onClick={setAgeFilter}>Set Age</button>
            <button onClick={setNameFilter}>Set Name</button>
            <button onClick={resetFilters}>Reset</button>
          </div>
        );
      };
      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      expect(screen.getByText("Filters: {}")).toBeInTheDocument();

      // Set age filter
      await screen.getByText("Set Age").click();
      expect(screen.getByText('Filters: {"age":30}')).toBeInTheDocument();

      // Set name filter
      await screen.getByText("Set Name").click();
      expect(
        screen.getByText('Filters: {"age":30,"name":"Alice"}')
      ).toBeInTheDocument();

      // Reset filters
      await screen.getByText("Reset").click();
      expect(screen.getByText("Filters: {}")).toBeInTheDocument();
    });
  });
});
