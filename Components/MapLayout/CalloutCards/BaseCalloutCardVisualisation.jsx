import React, { useEffect, useState, useContext } from "react";
import { FullScreenCalloutCardVisualisation } from "./FullScreenCalloutCardVisualisation";
import { CalloutCardVisualisation } from "./CalloutCardVisualisation";
import { useFetchVisualisationData } from "hooks";
import { MapContext } from "contexts";

/**
 * BaseCalloutCardVisualisation - Base component for displaying callout cards
 *
 * Renders either a small callout card or a full-screen carousel visualization
 * based on the type prop. Handles data fetching and dynamic updates for scenarios.
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
  const { state } = useContext(MapContext);
  const visualisation = state.visualisations[visualisationName];

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ========== Data Fetching ==========
  const response = useFetchVisualisationData(visualisation);

  /**
   * Initializes data based on card type
   * Uses mock data for development, will use real API response in production
   */
  useEffect(() => {
    if(!response.data) return;

    const updatedData = {
      data: {
        ...response.data,
            nav_next_id: 3,
            nav_prev_id: 1,
            nav_next_label: "Next!",
            nav_prev_label: "Previous!"
      },
      isLoading: response.isLoading,
    }

    setData(updatedData.data);
    setIsLoading(updatedData.isLoading);
  }, [response]);

  /**
   * Toggles the visibility of the card
   */
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  /**
   * Updates scenario data when fetching new scenarios
   *
   * Replaces the scenario in the data array with newly fetched data.
   * In production, this will call the real API endpoint.
   *
   * @param {number} scenarioId - The ID of the scenario to fetch and update
   */
  const onUpdateData = (scenarioId) => {
    
  };

  if (isLoading || !data || !isVisible) return null;

  return type === "fullscreen" ? (
    <FullScreenCalloutCardVisualisation
      data={data}
      // isLoading={isLoading}
      // toggleVisibility={toggleVisibility}
      handleNextFetch={(scenarioIdsList) => {
        onUpdateData(scenarioIdsList);
      }}
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
