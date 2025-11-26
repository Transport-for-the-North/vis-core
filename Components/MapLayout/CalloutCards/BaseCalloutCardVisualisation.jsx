import React, { useEffect, useState, useContext } from "react";
import { FullScreenCalloutCardVisualisation } from "./FullScreenCalloutCardVisualisation";
import { CalloutCardVisualisation } from "./CalloutCardVisualisation";
import { RecordSelector } from "./RecordSelector";
import { useFetchVisualisationData, useFilterContext } from "hooks";
import { MapContext } from "contexts";
import { actionTypes } from "reducers";
import { api } from "services";

/**
 * BaseCalloutCardVisualisation - Base component for displaying callout cards
 *
 * Renders either a small callout card or a full-screen carousel visualization
 * based on the type prop. Handles data fetching, prefetching, and dynamic updates for scenarios.
 * Supports both real API calls and mock data for development.
 *
 * IMPORTANT: Navigation ("next"/"previous") now routes through the filter system to
 * mirror Map's behavior. This ensures any configured actions tied to the location filter
 * are executed rather than hard-coded path-param updates.
 *
 * @component
 * @param {Object} props - The component props
 * @param {'small' | 'fullscreen'} [props.type='small'] - Display type of the card
 * @param {string} props.visualisationName - Name of the visualization from context
 * @param {string} props.cardName - Unique name identifier for the card
 * @param {Function} [props.onUpdate] - Callback function when card data updates
 * @param {string} [props.locationFilterId] - Optional explicit filter id to drive navigation (overrides heuristic resolution)
 *
 * @returns {JSX.Element|null} The rendered card component or null if loading/hidden
 */
export const BaseCalloutCardVisualisation = ({
  type = "small",
  visualisationName,
  cardName,
  onUpdate,
  locationFilterId,
  ...props
}) => {
  const sidebarIsOpen = props.sidebarIsOpen;
  const { state, dispatch } = useContext(MapContext);
  const { dispatch: filterDispatch } = useFilterContext();
  const visualisation = state.visualisations[visualisationName];

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for handling multiple records
  const [allRecords, setAllRecords] = useState([]);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const [hasMultipleRecords, setHasMultipleRecords] = useState(false);
  
  // Flag to prevent data reset when user has made a selection
  const [userHasSelectedRecord, setUserHasSelectedRecord] = useState(false);

  const [nextData, setNextData] = useState(null);
  const [prevData, setPrevData] = useState(null);

  const [isTransition, setIsTransition] = useState(false);

  // ========== Data Fetching ==========
  const response = useFetchVisualisationData(visualisation);
  const responseData = response.data;
  const remoteIsLoading = response.isLoading;

  /**
   * Synchronizes the displayed data with the fetched data,
   * except when we are in a transition (showing prefetched data).
   * Handles both single records and arrays of multiple records.
   */
  useEffect(() => {
    if (!isTransition && responseData) {
      // Check if response data is an array
      if (Array.isArray(responseData)) {
        const isNewDataSet = allRecords.length !== responseData.length;
        
        setAllRecords(responseData);
        setHasMultipleRecords(responseData.length > 1);
        
        if (responseData.length > 0) {
          // Only reset selection if this is new data or user hasn't made a selection
          if (isNewDataSet || !userHasSelectedRecord) {
            setData(responseData[0]);
            setSelectedRecordIndex(0);
            setUserHasSelectedRecord(false);
          } else {
            // Preserve current selection if possible
            const validIndex = selectedRecordIndex < responseData.length ? selectedRecordIndex : 0;
            setData(responseData[validIndex]);
            if (validIndex !== selectedRecordIndex) {
              setSelectedRecordIndex(validIndex);
            }
          }
        } else {
          setData(null);
        }
      } else {
        // Single record
        setAllRecords([responseData]);
        setHasMultipleRecords(false);
        setData(responseData);
        setSelectedRecordIndex(0);
        setUserHasSelectedRecord(false);
      }
      
      setIsLoading(remoteIsLoading);
    }
  }, [responseData, remoteIsLoading, isTransition, userHasSelectedRecord, allRecords.length, selectedRecordIndex]);

  /**
   * Ends the transition state when the fetched data matches the displayed data.
   * This allows the hook to resume control of the displayed data.
   */
  useEffect(() => {
    if (
      isTransition &&
      responseData &&
      responseData.location_id === data?.location_id
    ) {
      setIsTransition(false);
    }
  }, [responseData, isTransition, data]);

  /**
   * Handles selection of a different record from the dropdown
   * 
   * @param {number} index - Index of the selected record
   */
  const handleRecordSelection = (index) => {
    
    if (index >= 0 && index < allRecords.length) {
      setSelectedRecordIndex(index);
      setUserHasSelectedRecord(true);
      // Force a new object reference to ensure React detects the change
      setData({ ...allRecords[index] });
    }
  };

  /**
   * Gets display label for a record (used in dropdown)
   * 
   * @param {Object} record - The record object
   * @returns {string} Display label
   */
  const getRecordLabel = (record) => {
    // Try to get a meaningful label from the record
    return record.title || record.name || record.reference_id || `Record ${allRecords.indexOf(record) + 1}`;
  };



  /**
   * Prefetches data for the next or previous location.
   * This is called on hover of the navigation buttons.
   *
   * @param {number} locationId - The ID of the location to prefetch
   * @param {'next'|'previous'} mode - Direction of navigation
   */
  const onUpdateData = async (locationId, mode) => {
    if (
      !locationId ||
      (mode === "next" && nextData) ||
      (mode === "previous" && prevData)
    )
      return;

    const nextVisu = {
      ...visualisation,
      pathParams: {
        id: {
          ...visualisation.pathParams.id,
          value: locationId,
        },
      },
    };
    const dataUpdated = await prefetch(nextVisu);
    if (dataUpdated && mode === "next") setNextData(dataUpdated);
    if (dataUpdated && mode === "previous") setPrevData(dataUpdated);
  };

  /**
   * Converts a params map (queryParams/pathParams) to a simple key-value object.
   * Used for API calls.
   *
   * @param {Object} paramsMap - Map of param definitions
   * @returns {Object} - Plain object of key/value pairs
   */
  const toSimpleParamsMap = (paramsMap = {}) => {
    return Object.fromEntries(
      Object.entries(paramsMap)
        .filter(([, { value }]) => value !== null && value !== undefined)
        .map(([key, { value }]) => [key, value])
    );
  };

  /**
   * Fetches data for a given visualisation config (used for prefetching).
   *
   * @param {Object} nextVisu - Visualisation config for the location to fetch
   * @returns {Promise<Object>} - The fetched data
   */
  async function prefetch(nextVisu, mode) {
    const response = await api.baseService.get(nextVisu.dataPath, {
      pathParams: toSimpleParamsMap(nextVisu.pathParams),
      queryParams: toSimpleParamsMap(nextVisu.queryParams),
      skipAuth: !nextVisu.requiresAuth,
    });
    return response;
  }

  /**
   * Resolves a "location" filter to be used for navigation.
   * Tries in order:
   *  - Explicit locationFilterId prop
   *  - Filters with an UPDATE_PATH_PARAMS action for id (prefer one targeting this visualisation)
   *  - Filters whose field matches common id names: "id", "location_id", "loc_id"
   *  - First filter with actions
   *
   * @param {Array} filters - Filters from global state
   * @returns {Object|null} The resolved filter or null if none found
   */
  const resolveLocationFilter = (filters) => {
    if (!Array.isArray(filters) || filters.length === 0) return null;
    if (locationFilterId) {
      return filters.find((f) => f.id === locationFilterId) || null;
    }

    const byPathParam = filters.find(
      (f) =>
        Array.isArray(f.actions) &&
        f.actions.some(
          (a) =>
            a.action === actionTypes.UPDATE_PATH_PARAMS &&
            a.payload?.filter?.paramName === "id" &&
            // Try to prefer an action targeting this visualisation, but don't strictly require it
            (Array.isArray(a.payload?.filter?.visualisations)
              ? a.payload.filter.visualisations.includes(visualisationName)
              : true)
        )
    );
    if (byPathParam) return byPathParam;

    const byField = filters.find((f) =>
      ["id", "location_id", "loc_id"].includes(f.field)
    );
    if (byField) return byField;

    return filters.find((f) => Array.isArray(f.actions) && f.actions.length) || null;
  };

  /**
   * Runs the filter's configured actions for a given value and updates the filter's value.
   * Mirrors how Map dispatches filter actions (SET_FILTER_VALUE + per-action dispatch),
   * ensuring all side effects configured in the filter are applied.
   *
   * @param {Object|null} filter - The filter object to apply
   * @param {any} value - The value to set on the filter (location id)
   * @returns {boolean} True if actions were run, false if no filter was available
   */
  const runFilterActions = (filter, value) => {
    if (!filter) return false;

    // Update the filter value for consistency with UI
    filterDispatch({
      type: "SET_FILTER_VALUE",
      payload: { filterId: filter.id, value },
    });

    // Execute configured actions
    (filter.actions || []).forEach((action) => {
      dispatch({
        type: action.action,
        payload: { filter, value, ...action.payload },
      });
    });

    return true;
  };

  /**
   * Handles navigation to the next or previous location in the carousel.
   * Displays the prefetched data instantly, sets transition state,
   * and uses the filter system to dispatch the actions associated with the location id.
   * Falls back to the previous hard-coded UPDATE_PATH_PARAMS if no suitable filter is found.
   *
   * @param {'next'|'previous'} mode - Direction of navigation
   */
  const change = (mode) => {
    let targetData = null;
    switch (mode) {
      case "next":
        targetData = nextData;
        break;
      case "previous":
        targetData = prevData;
        break;
      default:
        break;
    }

    if (!targetData) return;

    setData(targetData);
    setIsTransition(true);

    const targetLocationId =
      targetData.location_id !== undefined && targetData.location_id !== null
        ? targetData.location_id
        : targetData.id;

    // Resolve a suitable filter and run its actions
    const locationFilter = resolveLocationFilter(state.filters);
    const ranFilterActions = runFilterActions(locationFilter, targetLocationId);

    // Fallback preserves previous implementation 
    if (!ranFilterActions) {
      dispatch({
        type: actionTypes.UPDATE_PATH_PARAMS,
        payload: {
          filter: {
            visualisations: ["Detailed Information"],
            paramName: "id",
          },
          value: targetLocationId,
        },
      });
    }
    setNextData(null);
    setPrevData(null);
  };

  if (isLoading || !data) return null;

  return type === "fullscreen" ? (
    <FullScreenCalloutCardVisualisation
      data={data}
      isLoading={isLoading}
      handleUpdatedData={(locationId, mode) => {
        onUpdateData(locationId, mode);
      }}
      handleChange={(mode) => change(mode)}
      sidebarIsOpen={sidebarIsOpen}
    />
  ) : (
    <CalloutCardVisualisation
      visualisationName={visualisationName}
      cardName={cardName}
      onUpdate={onUpdate}
      data={data}
      isLoading={isLoading}
      recordSelector={hasMultipleRecords ? (
        <RecordSelector
          records={allRecords}
          selectedIndex={selectedRecordIndex}
          onSelect={handleRecordSelection}
          getRecordLabel={getRecordLabel}
        />
      ) : null}
    />
  );
};
