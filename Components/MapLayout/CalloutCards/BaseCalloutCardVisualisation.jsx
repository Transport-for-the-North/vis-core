import React, { useEffect, useState, useContext } from "react";
import { FullScreenCalloutCardVisualisation } from "./FullScreenCalloutCardVisualisation";
import { CalloutCardVisualisation } from "./CalloutCardVisualisation";
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
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const { state, dispatch } = useContext(MapContext);
  const visualisation = state.visualisations[visualisationName];

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [nextData, setNextData] = useState(null);
  const [prevData, setPrevData] = useState(null);

  const [isTransition, setIsTransition] = useState(false);

  // ========== Data Fetching ==========
  const response = useFetchVisualisationData(visualisation);

  /**
   * Synchronizes the displayed data with the fetched data,
   * except when we are in a transition (showing prefetched data).
   */
  useEffect(() => {
    if (!isTransition && response.data) {
      setData(response.data);
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
    />
  ) : (
    <CalloutCardVisualisation
      visualisationName={visualisationName}
      cardName={cardName}
      onUpdate={onUpdate}
      data={{ data: data, isLoading: isLoading }}
      isLoading={isLoading}
      toggleVisibility={toggleVisibility}
    />
  );
};
