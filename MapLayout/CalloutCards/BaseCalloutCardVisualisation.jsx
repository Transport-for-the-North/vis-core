import React, { useEffect, useState, useContext } from "react";
import { FullScreenCalloutCardVisualisation } from "./FullScreenCalloutCardVisualisation";
import { CalloutCardVisualisation } from "./CalloutCardVisualisation";
import { RecordSelector } from "./RecordSelector";
import { useFetchVisualisationData } from "hooks";
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
 * @component
 * @param {Object} props - The component props
 * @param {'small' | 'fullscreen'} [props.type='small'] - Display type of the card
 * @param {string} props.visualisationName - Name of the visualization from context
 * @param {string} props.cardName - Unique name identifier for the card
 * @param {Function} [props.onUpdate] - Callback function when card data updates
 *
 * @returns {JSX.Element|null} The rendered card component or null if loading/hidden
 */
export const BaseCalloutCardVisualisation = ({
  type = "small",
  visualisationName,
  cardName,
  onUpdate,
  ...props
}) => {
  const sidebarIsOpen = props.sidebarIsOpen
  const [isVisible, setIsVisible] = useState(true);
  const { state, dispatch } = useContext(MapContext);
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

  /**
   * Synchronizes the displayed data with the fetched data,
   * except when we are in a transition (showing prefetched data).
   * Handles both single records and arrays of multiple records.
   */
  useEffect(() => {
    if (!isTransition && response.data) {
      // Check if response data is an array
      if (Array.isArray(response.data)) {
        const isNewDataSet = allRecords.length !== response.data.length;
        
        setAllRecords(response.data);
        setHasMultipleRecords(response.data.length > 1);
        
        if (response.data.length > 0) {
          // Only reset selection if this is new data or user hasn't made a selection
          if (isNewDataSet || !userHasSelectedRecord) {
            setData(response.data[0]);
            setSelectedRecordIndex(0);
            setUserHasSelectedRecord(false);
          } else {
            // Preserve current selection if possible
            const validIndex = selectedRecordIndex < response.data.length ? selectedRecordIndex : 0;
            setData(response.data[validIndex]);
            if (validIndex !== selectedRecordIndex) {
              setSelectedRecordIndex(validIndex);
            }
          }
        } else {
          setData(null);
        }
      } else {
        // Single record
        setAllRecords([response.data]);
        setHasMultipleRecords(false);
        setData(response.data);
        setSelectedRecordIndex(0);
        setUserHasSelectedRecord(false);
      }
      
      setIsLoading(response.isLoading);
    }
  }, [response, isTransition]);

  /**
   * Ends the transition state when the fetched data matches the displayed data.
   * This allows the hook to resume control of the displayed data.
   */
  useEffect(() => {
    if (
      isTransition &&
      response.data &&
      response.data.location_id === data?.location_id
    ) {
      setIsTransition(false);
    }
  }, [response.data, isTransition, data]);

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
   * Toggles the visibility of the card
   */
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
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
   * Handles navigation to the next or previous location in the carousel.
   * Displays the prefetched data instantly, sets transition state,
   * and updates the global state to trigger a refetch for consistency.
   *
   * @param {'next'|'previous'} mode - Direction of navigation
   */
  const change = (mode) => {
    console.log("sens : ", mode);
    switch (mode) {
      case "next":
        setData(nextData);
        setIsTransition(true);
        dispatch({
          type: actionTypes.UPDATE_PATH_PARAMS,
          payload: {
            filter: {
              visualisations: ["Detailed Information"],
              paramName: "id",
            },
            value: nextData.location_id,
          },
        });
        break;
      case "previous":
        setData(prevData);
        setIsTransition(true);
        dispatch({
          type: actionTypes.UPDATE_PATH_PARAMS,
          payload: {
            filter: {
              visualisations: ["Detailed Information"],
              paramName: "id",
            },
            value: prevData.location_id,
          },
        });
        break;
      default:
        break;
    }
    setNextData(null);
    setPrevData(null);
  };

  if (isLoading || !data || !isVisible) return null;

  return type === "fullscreen" ? (
    <FullScreenCalloutCardVisualisation
      data={data}
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
      toggleVisibility={toggleVisibility}
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
