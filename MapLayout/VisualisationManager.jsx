import React, { useState, useEffect, useRef } from 'react';
import { CalloutCardVisualisation } from './CalloutCards/CalloutCardVisualisation';
import { MapVisualisation } from './MapVisualisation';
import { ScrollableContainer } from 'Components';
import { FullScreenCalloutCardVisualisation } from "./CalloutCards/FullScreenCalloutCardVisualisation";


/**
 * VisualisationManager component that renders the appropriate visualizations
 * based on the types specified in the visualisation configurations.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.visualisationConfigs - Object of configuration objects for the visualizations.
 * @param {Object} props.map - The Maplibre JS map instance.
 * @param {Object} props.maps - The Maplibre JS map instances for left and right maps.
 * @returns {JSX.Element|null} The rendered visualization components.
 */
export const VisualisationManager = ({ visualisationConfigs, map, maps, ...props }) => {
  
  /* Simulate a fullcard in the config */
  visualisationConfigs = {
    ...visualisationConfigs,
    fullcard1: {
      type: 'fullScreenCalloutCard',
    cardName: 'Project Info',
    title: 'New Transport Project',
    content: '<p>Details about the new project...</p>',
    includeCarouselNavigation: true,
    possibleCarouselNavData: [
      {key: "key1", value: "value1"},
      {key: "key2", value: "value2"},
      {key: "key3", value: "value3"},
      {key: "key4", value: "value4"},
    ]
    },
  // smallCard2: {
  //   type: 'smallCalloutCard',
  //   cardName: 'Project Info',
  //   includeCarouselNavigation: false,
  //   possibleCarouselNavData: []
  // }
  }

  // Convert visualisationConfigs object to an array of entries
  const visualisationEntries = Object.entries(visualisationConfigs);
  // Separate visualizations by type
  // Small card
  const smallCalloutCardVisualisations = visualisationEntries.filter(
    ([_, config]) => config.type === "smallCalloutCard"
  );
  // FullScreen card
  const fullScreenCalloutCardVisualisations = visualisationEntries.filter(
    ([_, config]) => config.type === "fullScreenCalloutCard"
  );

  const mapVisualisations = visualisationEntries.filter(
    ([_, config]) => config.type === 'joinDataToMap' || config.type === 'geojson'
  );

  // Build a lookup for configs by name
  const smallCalloutCardConfigByName = Object.fromEntries(
    smallCalloutCardVisualisations
  );
  const fullScreenCalloutCardConfigByName = Object.fromEntries(
    fullScreenCalloutCardVisualisations
  );

  // State to manage order of cards
  const [smallCardOrder, setSmallCardOrder] = useState(
    smallCalloutCardVisualisations.map(([name]) => name)
  );
  const [fullScreenCardOrder, setFullScreenCardOrder] = useState(
    fullScreenCalloutCardVisualisations.map(([name]) => name)
  );

  const visibleMapRef = useRef({});
  const [visibleCount, setVisibleCount] = useState(0);
  
/**
 * Track visibility for a single card and refresh the aggregate count.
 * @name handleCardVisibility
 * @function
 * @global
 * @param {string} name - The visualisation/card identifier.
 * @param {boolean} isVisible - Whether the card is currently visible.
 */
  const handleCardVisibility = (name, isVisible) => {
    const next = { ...visibleMapRef.current, [name]: !!isVisible };
    visibleMapRef.current = next;
    setVisibleCount(Object.values(next).filter(Boolean).length);
  };

  const showOnMobile = visibleCount > 0;

  // Update cardOrder when visualisationConfigs change
  useEffect(() => {
    const newOrder = smallCalloutCardVisualisations.map(([name]) => name);
    setSmallCardOrder((prevOrder) => {
      // Keep existing order as much as possible
      const newPrevOrder = prevOrder.filter((name) => newOrder.includes(name));
      const addedNames = newOrder.filter(
        (name) => !newPrevOrder.includes(name)
      );
      return [...newPrevOrder, ...addedNames];
    });
  }, [visualisationConfigs, smallCalloutCardVisualisations]);

  // Handler when a card is updated
  const handleCardUpdate = (updatedName) => {
    setSmallCardOrder((prevOrder) => [
      updatedName,
      ...prevOrder.filter((name) => name !== updatedName),
    ]);
  };

  return (
    <>
      {/* Render all calloutCard visualisations inside ScrollableContainer */}
      <ScrollableContainer showOnMobile={showOnMobile} hideCardHandleOnMobile>
        {/* Small */}
        {smallCardOrder.map((name) => {
          const config = smallCalloutCardConfigByName[name];
          return (
            <CalloutCardVisualisation
              key={name}
              visualisationName={name}
              cardName={config.cardName || name}
              onUpdate={() => handleCardUpdate(name)}
              onVisibilityChange={(v) => handleCardVisibility(name, v)}
              {...props}
            />
          );
        })}
        {/* Full screen */}
        {fullScreenCardOrder.map((name) => {
          const config = fullScreenCalloutCardConfigByName[name];
          return (
            <FullScreenCalloutCardVisualisation
              content={config.content}
              title={config.title}
              includeCarouselNavigation={config.includeCarouselNavigation}
              possibleCarouselNavData={config.possibleCarouselNavData}
            />
          );
        })}
      </ScrollableContainer>

      {/* Render all MapVisualisations */}
      {mapVisualisations.map(([name]) => (
        <MapVisualisation
          key={name}
          visualisationName={name}
          map={map}
          maps={maps}
          left={props.left}
          {...props}
        />
      ))}
    </>
  );
};
