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
    setData(response.data);
    setIsLoading(response.isLoading);
  }, [response]);

  let includeCarouselNavigation;
  let possibleCarouselNavData = [];
  if (type === "fullscreen") {
    includeCarouselNavigation = data && data.length > 1;
    if (includeCarouselNavigation)
      possibleCarouselNavData = data
        ? data.map((item) => ({ key: item.scenario_id, value: item.label }))
        : [];
  }

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
    // Fetch with a list of scenario ??
    // real
    // const { isLoading: isLoadingLocal, data: dataLocal } = useFetchVisualisationData(scenarioId);
    // mock
    const mockDataMap = {
      15: {
        programme_id: 2,
        scenario_id: 15,
        point_geom: {
          type: "Point",
          coordinates: [-1.57, 53.805],
        },
        polygon_geom: {
          type: "Polygon",
          coordinates: [
            [
              [-1.571, 53.804],
              [-1.569, 53.804],
              [-1.569, 53.806],
              [-1.571, 53.806],
              [-1.571, 53.804],
            ],
          ],
        },
        label: "Pessimistic Future",
        image: "https://www.w3schools.com/howto/img_avatar.png",
        text_with_placeholders:
          "On update - Pessimistic Future with <strong>{distance}</strong> km",
        values: {
          distance: 5,
          duration: 20,
        },
      },
      16: {
        programme_id: 3,
        scenario_id: 16,
        point_geom: {
          type: "Point",
          coordinates: [-1.58, 53.81],
        },
        polygon_geom: {
          type: "Polygon",
          coordinates: [
            [
              [-1.581, 53.809],
              [-1.579, 53.809],
              [-1.579, 53.811],
              [-1.581, 53.811],
              [-1.581, 53.809],
            ],
          ],
        },
        label: "Another Future",
        image: "https://www.w3schools.com/howto/img_avatar2.png",
        text_with_placeholders:
          "Another Future - Distance: <strong>{distance}</strong> km, Duration: <strong>{duration}</strong> min",
        values: {
          distance: 8,
          duration: 35,
        },
      },
    };

    const fetchedScenario = mockDataMap[scenarioId];

    // Replace the scenario in the data array
    const updatedData = data.map((item) =>
      item.scenario_id === scenarioId ? fetchedScenario : item
    );

    // Update carousel navigation data
    includeCarouselNavigation = updatedData && updatedData.length > 1;
    possibleCarouselNavData = updatedData
      ? updatedData.map((item) => ({
          key: item.scenario_id,
          value: item.label,
        }))
      : [];

    // Update state with new data
    setData(updatedData);
    setIsLoading(false);
  };

  if (isLoading || !data || !isVisible) return null;

  return type === "fullscreen" ? (
    <FullScreenCalloutCardVisualisation
      data={data}
      isLoading={isLoading}
      includeCarouselNavigation={includeCarouselNavigation}
      possibleCarouselNavData={possibleCarouselNavData}
      toggleVisibility={toggleVisibility}
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
