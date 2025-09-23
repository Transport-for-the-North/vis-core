import React, { useState, useEffect, useRef } from 'react';
import { CalloutCardVisualisation } from './CalloutCards/CalloutCardVisualisation';
import { MapVisualisation } from './MapVisualisation';
import { ScrollableContainer } from 'Components';


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
  // Convert visualisationConfigs object to an array of entries
  const visualisationEntries = Object.entries(visualisationConfigs);

  // Separate visualizations by type
  const calloutCardVisualisations = visualisationEntries.filter(
    ([_, config]) => config.type === 'calloutCard'
  );

  const mapVisualisations = visualisationEntries.filter(
    ([_, config]) => config.type === 'joinDataToMap' || config.type === 'geojson'
  );

  // Build a lookup for configs by name
  const calloutCardConfigByName = Object.fromEntries(calloutCardVisualisations);

  // State to manage order of cards
  const [cardOrder, setCardOrder] = useState(
    calloutCardVisualisations.map(([name]) => name)
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
    const newOrder = calloutCardVisualisations.map(([name]) => name);
    setCardOrder((prevOrder) => {
      // Keep existing order as much as possible
      const newPrevOrder = prevOrder.filter((name) => newOrder.includes(name));
      const addedNames = newOrder.filter((name) => !newPrevOrder.includes(name));
      return [...newPrevOrder, ...addedNames];
    });
  }, [visualisationConfigs]);

  // Handler when a card is updated
  const handleCardUpdate = (updatedName) => {
    setCardOrder((prevOrder) => [
      updatedName,
      ...prevOrder.filter((name) => name !== updatedName),
    ]);
  };

  return (
    <>
      {/* Render all calloutCard visualisations inside ScrollableContainer */}
      <ScrollableContainer showOnMobile={showOnMobile} hideCardHandleOnMobile>
        {cardOrder.map((name) => {
          const config = calloutCardConfigByName[name];
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
