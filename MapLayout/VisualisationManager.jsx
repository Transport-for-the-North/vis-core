import React from 'react';
import { CalloutCardVisualisation } from './CalloutCardVisualisation';
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
    ([_, config]) => (config.type === 'joinDataToMap' || config.type === 'geojson')
  );

  return (
    <>
      {/* Render all calloutCard visualiations inside ScrollableContainer */}
      <ScrollableContainer>
        {calloutCardVisualisations.map(([name, config]) => (
          <CalloutCardVisualisation
            key={name}
            visualisationName={name}
            cardName={config.cardName || name}
            {...props}
          />
        ))}
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